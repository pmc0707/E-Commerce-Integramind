from config import MONGO_URI, JWT_SECRET_KEY

client = MongoClient(MONGO_URI)
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
