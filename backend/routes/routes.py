from fastapi import APIRouter
from utils import standard_response, login_required

router = APIRouter()

@router.get("/example")
@standard_response
def example_endpoint():
    return "Example endpoint response aa"