from fastapi import APIRouter, Depends
from utils import standard_response

ml_router = APIRouter()

@ml_router.get("/example")
@standard_response
def example_endpoint():
    return "Example endpoint response aa"