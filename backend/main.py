from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException
from bson import ObjectId
from pymongo import MongoClient

app = FastAPI()

client = MongoClient("mongodb://localhost:27017/")
db = client['E-waste']
user_admin_info_collection = db['user_admin_info']
collection_collection = db['Collection']

#define Model
class UserAdminInfo(BaseModel):
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

@app.post("/add_user_admin_info/")
async def add_user_admin_info(user_admin_info: UserAdminInfo):
    
    result = await user_admin_info_collection.insert_one(user_admin_info.__dict__)

    return {"inserted_id": str(result.inserted_id)}

@app.post("/add_collection/")
async def add_collection(collection: Collection):
    result = await collection_collection.insert_one(collection.__dict__)
    return {"inserted_id": str(result.inserted_id)}

@app.get("/get_user_collections/{user_id}")
async def get_user_collections(user_id: str):
    collections = await collection_collection.find({"user_id": user_id}).to_list()
    if collections:
        return collections
    else:
        raise HTTPException(status_code=404, detail="No collections found for this user_id")

@app.get("/get_stage_1_collections/")
async def get_stage_1_collections():
    collections = await collection_collection.find({"stage": 1}).to_list()
    return collections

@app.get("/get_admin_collections/{admin_id}")
async def get_admin_collections(admin_id: str):
    collections = await user_admin_info_collection.find({"_id": ObjectId(admin_id), "is_admin": True}).to_list(100)
    if collections:
        return collections
    else:
        raise HTTPException(status_code=404, detail="No collections found for this admin_id")
