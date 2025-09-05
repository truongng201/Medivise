from fastapi import APIRouter, Depends
from utils import standard_response, login_required, logger

api_router = APIRouter()

@api_router.get("/example")
@standard_response
def example_endpoint(user_info: int = Depends(login_required)):
    logger.info(f"User info: {user_info}")
    return "Example endpoint response aa"