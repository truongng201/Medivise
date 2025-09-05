from fastapi import APIRouter, Depends
from utils import standard_response

ml_router = APIRouter()

@ml_router.get("/get_model_metadata")
@standard_response
def get_model_metadata():
    return "Model metadata response"