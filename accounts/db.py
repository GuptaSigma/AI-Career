import os
from pymongo import MongoClient
from pymongo.errors import InvalidURI
from dotenv import load_dotenv

load_dotenv()

MONGO_URI=os.getenv("MONGO_URI")

user_collection=None
roadmaps_collection=None

if MONGO_URI:
    try:
        client=MongoClient(MONGO_URI)
        db=client['ai_career_mentor_db']
        if db is not None:
            user_collection=db['users']
            roadmaps_collection=db['roadmaps']
            print("MangoDB connection Successful")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
else:
    print("Warning: MONGO_URI is not set. MongoDB connection will not be established.")
    
