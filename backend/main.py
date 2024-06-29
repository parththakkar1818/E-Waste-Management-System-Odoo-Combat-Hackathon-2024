from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List
import json

app = FastAPI()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client['E-waste']
user_admin_info_collection = db['user_admin_info']
collection_collection = db['Collection']

# Custom JSON encoder to handle ObjectId
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Define Pydantic models
class UserAdminInfo(BaseModel):
    user_admin_id: str 
    name: str
    address: str
    mobile_no: str
    is_admin: bool

class Collection(BaseModel):
    user_id: str
    type: str
    e_waste_weight: float
    prefdate: str
    stage: int = 1
    clerk_id: int = 0

# Helper function to convert MongoDB document to dict
def doc_to_dict(doc):
    return {k: str(v) if isinstance(v, ObjectId) else v for k, v in doc.items()}

# Endpoints
@app.post("/add_user_admin_info/")
async def add_user_admin_info(user_admin_info: UserAdminInfo):
    result = user_admin_info_collection.insert_one(user_admin_info.dict(by_alias=True))
    return {"inserted_id": str(result.inserted_id)}

@app.post("/add_collection/")
async def add_collection(collection: Collection):
    result = collection_collection.insert_one(collection.dict(by_alias=True))
    return {"inserted_id": str(result.inserted_id)}

@app.get("/get_user_collections/{user_id}")
async def get_user_collections(user_id: str):
    collections = collection_collection.find({"user_id": user_id})
    if collections:
        return [doc_to_dict(doc) for doc in collections]
    else:
        raise HTTPException(status_code=404, detail="No collections found for this user_id")

@app.get("/get_stage_1_collections/")
async def get_stage_1_collections():
    collections = collection_collection.find({"stage": 1})
    return [doc_to_dict(doc) for doc in collections]

@app.get("/get_admin_collections/{admin_id}")
async def get_admin_collections(admin_id: str):
    collections = user_admin_info_collection.find({"_id": ObjectId(admin_id), "is_admin": True}).limit(100)
    if collections.count() > 0:
        return [doc_to_dict(doc) for doc in collections]
    else:
        raise HTTPException(status_code=404, detail="No collections found for this admin_id")
