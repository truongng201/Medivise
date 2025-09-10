from fastapi import APIRouter, Depends
from utils import standard_response, login_required, logger

patient_router = APIRouter()

@patient_router.get("/example")
@standard_response
def example_endpoint():
    return "Example endpoint response aa"