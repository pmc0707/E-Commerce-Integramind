import os
import logging
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')  # Try pinging MongoDB to confirm connection
    logging.info("✅ Successfully connected to MongoDB.")
except Exception as e:
    logging.error(f"❌ Failed to connect to MongoDB: {e}")
    raise e

# MongoDB collections
db = client['userdb']
user_collection = db['users']
product_collection = db['products']
orders_collection = db['orders']
coupons_collection = db['coupons']

# JWT config
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# ---------------- AUTH ROUTES ----------------

@app.route('/api/register', methods=['POST', 'PUT'])
def register_user():
    try:
        if request.method == 'POST':
            user_data = request.json
            fullName = user_data['fullName']
            email = user_data['email']
            password = user_data['password']
            userType = user_data.get('userType', 'regular')

            if user_collection.find_one({"email": email}):
                return jsonify({"error": "User already exists"}), 400

            hashed_password = generate_password_hash(password)

            if userType == 'admin':
                new_user = {
                    "fullName": fullName,
                    "email": email,
                    "password": hashed_password,
                    "avatarUrl": "",
                    "userType": userType,
                    "yourProducts": []
                }
            else:
                new_user = {
                    "fullName": fullName,
                    "email": email,
                    "password": hashed_password,
                    "avatarUrl": "",
                    "userType": userType,
                    "orders": {
                        "pending": [], "shipped": [], "delivered": [], "cancelled": []
                    },
                    "cart": [],
                    "interest": []
                }

            user_collection.insert_one(new_user)
            return jsonify({"message": "User registered successfully"}), 201

        elif request.method == 'PUT':
            user_email = request.json.get('email')
            interest_category = request.json.get('interest')

            user = user_collection.find_one({"email": user_email})
            if user:
                interests = user.get('interest', [])

                if interest_category not in interests:
                    if len(interests) < 3:
                        interests.append(interest_category)
                    elif len(interests) == 3:
                        interests.pop(2)
                        interests.append(interest_category)
                    else:
                        return jsonify({"error": "Interest field must not exceed 3 items."}), 400

                user_collection.update_one({"email": user_email}, {"$set": {"interest": interests}})
                return jsonify({"message": "Interest updated successfully"}), 200
            else:
                return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        user_data = request.json
        email = user_data['email']
        password = user_data['password']
        user = user_collection.find_one({"email": email})

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(identity={"email": email, "fullName": user['fullName']})
        return jsonify({"message": "Login successful", "access_token": access_token}), 200

    except Exception as e:
        logging.error(f"Error in login_user: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ---------------- PROFILE ROUTES ----------------

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')

        user = user_collection.find_one({"email": email}, {"_id": False, "password": False})
        if user:
            user_products = []
            if user.get('userType') == 'admin':
                products = product_collection.find({"ownerName": user['fullName']})
                user_products = [product['id'] for product in products]

            return jsonify({
                "message": "Access to profile",
                "user": {
                    "email": user['email'],
                    "fullName": user['fullName'],
                    "interests": user.get('interest', []),
                    "userType": user.get('userType', 'regular'),
                    "yourProducts": user_products
                }
            }), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        logging.error(f"Error fetching profile: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')
        product_id = request.json.get('productId')

        user_collection.update_one(
            {"email": email},
            {"$addToSet": {"yourProducts": product_id}}
        )

        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        logging.error(f"Error updating profile: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ---------------- ADMIN USER ROUTE ----------------

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    if current_user['email'] != 'admin@example.com':
        return jsonify({"error": "Access forbidden"}), 403

    users = list(user_collection.find({}, {"_id": False, "password": False}))
    return jsonify({"users": users}), 200

# ---------------- PRODUCTS ROUTES ----------------

@app.route('/products', methods=['POST'])
def create_products():
    try:
        products = request.json
        product_list = []
        for request_data in products:
            product = {
                "id": request_data["id"],
                "title": request_data["title"],
                "price": request_data["price"],
                "description": request_data["description"],
                "category": request_data["category"],
                "image": request_data["image"],
                "rating": {
                    "rate": request_data["rating"]["rate"],
                    "count": request_data["rating"]["count"]
                },
                "ownerName": request_data.get("ownerName", "")
            }
            product_list.append(product)
        result = product_collection.insert_many(product_list)
        return jsonify({
            "message": "Products created successfully",
            "product_ids": [str(pid) for pid in result.inserted_ids]
        }), 201

    except Exception as e:
        logging.error(f"Error creating products: {str(e)}")
        return jsonify({"error": str(e)}), 400


@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = list(product_collection.find({}, {'_id': False}))
        return jsonify(products), 200
    except Exception as e:
        logging.error(f"Error getting products: {str(e)}")
        return jsonify({"error": str(e)}), 400


@app.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = product_collection.find_one({"id": product_id}, {'_id': False})
        if product:
            return jsonify(product), 200
        else:
            return jsonify({"message": "Product not found"}), 404
    except Exception as e:
        logging.error(f"Error getting product by ID: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route('/products/add', methods=['POST'])
def add_product():
    try:
        product_data = request.json
        product = {
            "id": product_data["id"],
            "title": product_data["title"],
            "price": product_data["price"],
            "description": product_data["description"],
            "category": product_data["category"],
            "image": product_data["image"],
            "rating": {
                "rate": product_data["rating"]["rate"],
                "count": product_data["rating"]["count"]
            },
            "ownerName": product_data.get("ownerName", "")
        }
        product_collection.insert_one(product)
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        logging.error(f"Error adding product: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ---------------- CART ROUTES ----------------

@app.route('/api/cart/add', methods=['PUT'])
@jwt_required()
def add_to_cart():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')
        product_id = request.json.get('productId')
        user_collection.update_one({"email": email}, {"$addToSet": {"cart": product_id}})
        return jsonify({"message": "Product added to cart"}), 200
    except Exception as e:
        logging.error(f"Error adding to cart: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')
        user = user_collection.find_one({"email": email}, {"_id": False, "cart": True})
        if user:
            product_ids = user.get('cart', [])
            cart_products = list(product_collection.find({"id": {"$in": product_ids}}, {"_id": False}))
            return jsonify(cart_products), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error getting cart: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ---------------- ORDERS ----------------

@app.route('/orders', methods=['GET', 'POST'])
def handle_orders():
    try:
        if request.method == 'POST':
            new_order = request.json
            new_order['date_of_buy'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            new_order['delivery_date'] = (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')
            new_order['status'] = ['Order Processing', 'Packaging', 'Shipping', 'Out for Delivery']
            orders_collection.insert_one(new_order)
            return jsonify({'message': 'Order added'}), 201

        orders = list(orders_collection.find({}, {'_id': False}))
        return jsonify({'orders': orders}), 200

    except Exception as e:
        logging.error(f"Error in handle_orders: {str(e)}")
        return jsonify({"error": str(e)}), 400

# ---------------- COUPONS ----------------

@app.route('/api/coupons', methods=['POST'])
def create_coupon():
    data = request.json
    coupon = {
        'coupon_code': data['coupon_code'],
        'coupon_value': data['coupon_value'],
        'coupon_type': data['coupon_type'],
        'cart_minimum': data['cart_minimum'],
        'status': data['status']
    }
    coupon_id = coupons_collection.insert_one(coupon).inserted_id
    return jsonify(str(ObjectId(coupon_id)))

@app.route('/api/coupons', methods=['GET'])
def get_coupons():
    coupons = list(coupons_collection.find())
    for coupon in coupons:
        coupon['_id'] = str(coupon['_id'])
    return jsonify(coupons)

@app.route('/api/coupons/<id>', methods=['GET'])
def get_coupon(id):
    coupon = coupons_collection.find_one({'_id': ObjectId(id)})
    if coupon:
        coupon['_id'] = str(coupon['_id'])
        return jsonify(coupon)
    return jsonify({'error': 'Coupon not found'}), 404

@app.route('/api/coupons/<id>', methods=['PUT'])
def update_coupon(id):
    data = request.json
    updated_coupon = {
        'coupon_code': data['coupon_code'],
        'coupon_value': data['coupon_value'],
        'coupon_type': data['coupon_type'],
        'cart_minimum': data['cart_minimum'],
        'status': data['status']
    }
    result = coupons_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_coupon})
    if result.matched_count:
        return jsonify({'message': 'Coupon updated successfully'})
    return jsonify({'error': 'Coupon not found'}), 404

# ---------------- SERVER START ----------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
