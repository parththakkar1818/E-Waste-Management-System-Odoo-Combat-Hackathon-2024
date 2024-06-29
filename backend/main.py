from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Literal
import json
from fastapi.middleware.cors import CORSMiddleware
from e_waste_formulas import calculate_e_waste_metrics  # Import the function

app = FastAPI()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client['E-waste']
user_admin_info_collection = db['user_admin_info']
collection_collection = db['Collection']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with the list of allowed origins if you know them
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
     user_id:str
    e_waste_type: str
    e_waste_weight: float
    prefdate: str
    prefTime: str
    stage: int = 1
    admin_id: str="0"
    price:int=0
    co2:float=0
    cu:float=0
    alum:float=0
    Equivalent_Driving_Distance:float=0

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

@app.get("/get_task/{task_id}")
async def get_task(task_id: str):
    collections = collection_collection.find({"_id": ObjectId(task_id)})
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



@app.get("/home_analytics")
async def home_analytics():
    pipeline = [
        {
            "$group": {
                "_id": None,
                "active_users": {"$addToSet": "$user_id"},
                "total_weight": {"$sum": "$e_waste_weight"},
                "active_recyclers": {"$addToSet": "$admin_id"},
                "total_transaction": {"$sum": "$price"},
                "co2_saved": {"$sum": "$co2"},
                "copper": {"$sum": "$cu"},
                "aluminium": {"$sum": "$alum"},
                "weight_by_type": {
                    "$push": {
                        "type": "$e_waste_type",
                        "weight": "$e_waste_weight"
                    }
                }
            }
        },
        {
            "$project": {
                "active_users": {"$size": "$active_users"},
                "total_weight": 1,
                "active_recyclers": {"$size": "$active_recyclers"},
                "total_transaction": 1,
                "co2_saved": 1,
                "copper": 1,
                "aluminium": 1,
                "weight_by_type": 1
            }
        }
    ]
    
    result = list(collection_collection.aggregate(pipeline))
    
    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    
    analytics = result[0]
    
    # Process weight_by_type to sum weights for each type
    weight_by_type = {}
    for item in analytics['weight_by_type']:
        if item['type'] in weight_by_type:
            weight_by_type[item['type']] += item['weight']
        else:
            weight_by_type[item['type']] = item['weight']
    
    analytics['weight_by_type'] = weight_by_type
    
    return analytics

@app.get("/admin_analytics/{admin_id}")
async def admin_analytics(admin_id: str):
    pipeline = [
        {"$match": {"admin_id": admin_id}},
        {
            "$group": {
                "_id": None,
                "total_requests": {"$sum": 1},
                "total_weight": {"$sum": "$e_waste_weight"},
                "total_payment": {"$sum": "$price"},
                "total_co2": {"$sum": "$co2"},
                "total_cu": {"$sum": "$cu"},
                "total_alum": {"$sum": "$alum"},
                "weight_by_type": {
                    "$push": {
                        "type": "$e_waste_type",
                        "weight": "$e_waste_weight"
                    }
                }
            }
        }
    ]
    
    result = list(collection_collection.aggregate(pipeline))
    
    if not result:
        raise HTTPException(status_code=404, detail=f"No data found for admin_id: {admin_id}")
    
    analytics = result[0]
    
    # Process weight_by_type to sum weights for each type
    weight_by_type = {}
    for item in analytics['weight_by_type']:
        if item['type'] in weight_by_type:
            weight_by_type[item['type']] += item['weight']
        else:
            weight_by_type[item['type']] = item['weight']
    
    analytics['weight_by_type'] = weight_by_type
    
    return analytics

@app.get("/user_analytics/{user_id}")
async def user_analytics(user_id: str):
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": None,
                "total_requests": {"$sum": 1},
                "total_weight": {"$sum": "$e_waste_weight"},
                "total_payment": {"$sum": "$price"},
                "total_co2": {"$sum": "$co2"},
                "total_cu": {"$sum": "$cu"},
                "total_alum": {"$sum": "$alum"},
                "total_driving_distance": {"$sum": "$Equivalent_Driving_Distance"},
                "weight_by_type": {
                    "$push": {
                        "type": "$e_waste_type",
                        "weight": "$e_waste_weight"
                    }
                }
            }
        }
    ]
    
    result = list(collection_collection.aggregate(pipeline))
    
    if not result:
        raise HTTPException(status_code=404, detail=f"No data found for user_id: {user_id}")
    
    analytics = result[0]
    
    # Process weight_by_type to sum weights for each type
    weight_by_type = {}
    for item in analytics['weight_by_type']:
        if item['type'] in weight_by_type:
            weight_by_type[item['type']] += item['weight']
        else:
            weight_by_type[item['type']] = item['weight']
    
    analytics['weight_by_type'] = weight_by_type
    
    return analytics
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)  
