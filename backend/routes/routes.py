from fastapi import APIRouter, Depends, Query

router = APIRouter()

@router.get("/example")
def example_endpoint(param: str = Query(..., description="An example query parameter")):
    return {"message": f"Received parameter: {param}"}