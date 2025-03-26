import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime, timedelta
import logging
from bson import ObjectId
from dotenv import load_dotenv
# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['userdb']
user_collection = db['users']
product_collection = db['products']
orders_collection = db['orders']
coupons_collection = db['coupons']


# Configure JWT Secret Key from environment variables
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

jwt = JWTManager(app)

# Route to handle user registration and updates
@app.route('/api/register', methods=['POST', 'PUT'])  # Add PUT method
def register_user():
    try:
        if request.method == 'POST':
            # Registration logic
            user_data = request.json
            fullName = user_data['fullName']
            email = user_data['email']
            password = user_data['password']
            userType = user_data.get('userType', 'regular')  # Fetch userType, default to 'regular'

            # Check if user already exists
            if user_collection.find_one({"email": email}):
                return jsonify({"error": "User already exists"}), 400

            # Hash password for security
            hashed_password = generate_password_hash(password)

            if userType == 'admin':
                new_user = {
                    "fullName": fullName,
                    "email": email,
                    "password": hashed_password,
                    "avatarUrl": "",  # Optional field, can be filled later
                    "userType": userType,  # Use userType from request, either 'regular' or 'admin'
                    "yourProducts": []  # Array for admin users to manage their products
                }
            else:
                new_user = {
                    "fullName": fullName,
                    "email": email,
                    "password": hashed_password,
                    "avatarUrl": "",  # Optional field, can be filled later
                    "userType": userType,  # Use userType from request, either 'regular' or 'admin'
                    "orders": {
                        "pending": [],
                        "shipped": [],
                        "delivered": [],
                        "cancelled": [],
                    },
                    "cart": [],  # Regular users will have a cart
                    "interest": []  # Regular users will have interests
                }

            # Insert the new user into the database
            user_collection.insert_one(new_user)
            return jsonify({"message": "User registered successfully"}), 201

        elif request.method == 'PUT':
            # Update user interests logic
            user_email = request.json.get('email')  # Get the user's email from the request
            interest_category = request.json.get('interest')  # Get the interest category from the request

            # Find the user by email
            user = user_collection.find_one({"email": user_email})
            if user:
                interests = user.get('interest', [])

                # Update interests (ensure the total number of interests does not exceed 3)
                if interest_category not in interests:
                    if len(interests) < 3:
                        interests.append(interest_category)
                    elif len(interests) == 3:
                        # Remove the oldest interest and add the new one
                        interests.pop(2)
                        interests.append(interest_category)
                    else:
                        return jsonify({"error": "Interest field must not exceed 3 items."}), 400

                # Update the user interests in the database
                user_collection.update_one({"email": user_email}, {"$set": {"interest": interests}})
                return jsonify({"message": "Interest updated successfully"}), 200
            else:
                return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to handle user login and return JWT token
@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        user_data = request.json
        email = user_data['email']
        password = user_data['password']

        # Find user by email
        user = user_collection.find_one({"email": email})

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT token
        access_token = create_access_token(identity={"email": email, "fullName": user['fullName']})

        return jsonify({"message": "Login successful", "access_token": access_token}), 200

    except Exception as e:
        logging.error(f"Error in login_user: {str(e)}")
        return jsonify({"error": str(e)}), 400


# Protected route example (Only accessible with a valid JWT token)
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')

        # Fetch the user's full details from the database, excluding password and _id
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
        logging.error(f"Error fetching user profile: {str(e)}")
        return jsonify({"error": "An error occurred while fetching the profile. Please try again later."}), 500


@app.route('/api/profile/update', methods=['PUT'])  # Changed from PATCH to PUT
@jwt_required()
def update_profile():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')
        product_id = request.json.get('productId')

        # Ensure yourProducts contains unique product IDs
        user_collection.update_one(
            {"email": email},
            {"$addToSet": {"yourProducts": product_id}}  # Add productId to yourProducts if it doesn't already exist
        )

        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        logging.error(f"Error in update_profile: {str(e)}")
        return jsonify({"error": str(e)}), 500


# List all users (Admin feature - protected route)
@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()

    if current_user['email'] != 'admin@example.com':
        return jsonify({"error": "Access forbidden"}), 403

    users = list(user_collection.find({}, {"_id": False, "password": False}))
    return jsonify({"users": users}), 200


# Products routes
@app.route('/products', methods=['POST'])
def create_products():
    try:
        products = request.json
        product_list = []

        for request_data in products:
            product_data = {
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
                "ownerName": request_data.get("ownerName", "")  # New field for ownerName
            }
            product_list.append(product_data)

        result = product_collection.insert_many(product_list)
        return jsonify({
            "message": "Products created successfully",
            "product_ids": [str(inserted_id) for inserted_id in result.inserted_ids]
        }), 201

    except Exception as e:
        logging.error(f"Error in create_products: {str(e)}")
        return jsonify({"error": str(e)}), 400


@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = list(product_collection.find({}, {'_id': False}))
        return jsonify(products), 200

    except Exception as e:
        logging.error(f"Error in get_products: {str(e)}")
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
        logging.error(f"Error in get_product_by_id: {str(e)}")
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
        logging.error(f"Error in add_product: {str(e)}")
        return jsonify({"error": str(e)}), 400


# Orders endpoint
@app.route('/orders', methods=['GET', 'POST'])
def handle_orders():
    if request.method == 'POST':
        try:
            new_order = request.json
            new_order['date_of_buy'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            new_order['delivery_date'] = (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')
            new_order['status'] = ['Order Processing', 'Packaging', 'Shipping', 'Out for Delivery']
            orders_collection.insert_one(new_order)
            return jsonify({'message': 'Order added'}), 201
        except Exception as e:
            logging.error(f"Error in handle_orders (POST): {str(e)}")
            return jsonify({"error": str(e)}), 400

    try:
        orders = list(orders_collection.find({}, {'_id': False}))
        return jsonify({'orders': orders}), 200
    except Exception as e:
        logging.error(f"Error in handle_orders (GET): {str(e)}")
        return jsonify({"error": str(e)}), 400



@app.route('/api/cart/add', methods=['PUT'])
@jwt_required()
def add_to_cart():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')
        product_id = request.json.get('productId')

        # Ensure the cart contains unique product IDs
        user_collection.update_one(
            {"email": email},
            {"$addToSet": {"cart": product_id}}  # Add productId to cart if it doesn't already exist
        )

        return jsonify({"message": "Product added to cart successfully"}), 200
    except Exception as e:
        logging.error(f"Error in add_to_cart: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        current_user = get_jwt_identity()
        email = current_user.get('email')

        # Fetch user details
        user = user_collection.find_one({"email": email}, {"_id": False, "cart": True})
        
        if user:
            cart_products_ids = user.get('cart', [])
            # Fetch products from the product collection based on cart IDs
            cart_products = list(product_collection.find({"id": {"$in": cart_products_ids}}, {'_id': False}))
            return jsonify(cart_products), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        logging.error(f"Error in get_cart: {str(e)}")
        return jsonify({"error": str(e)}), 500



# for Coupan

from bson import ObjectId

coupons_collection = db['coupons']  # Collection name

# Create a new coupon
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

# Get all coupons
@app.route('/api/coupons', methods=['GET'])
def get_coupons():
    coupons = list(coupons_collection.find())
    for coupon in coupons:
        coupon['_id'] = str(coupon['_id']) 
    return jsonify(coupons)

# Get a single coupon by ID
@app.route('/api/coupons/<id>', methods=['GET'])
def get_coupon(id):
    coupon = coupons_collection.find_one({'_id': ObjectId(id)})
    if coupon:
        coupon['_id'] = str(coupon['_id'])  # Convert ObjectId to string
        return jsonify(coupon)
    return jsonify({'error': 'Coupon not found'}), 404

# Update a coupon
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


if __name__ == "__main__":
    app.run(debug=True)