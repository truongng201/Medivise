import os

from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from routes import ml_router, api_router
from utils import standard_response, StandardResponse, CustomException, Database, Cache
from fastapi.middleware.cors import CORSMiddleware

ENV = os.getenv("ENV", "development")
APP_VERSION = os.getenv("APP_VERSION", "version") if ENV == "production" else ENV
API_VERSION = os.getenv("API_VERSION", "v1")

app = FastAPI(title="Mediverse Backend", version=APP_VERSION[:7])

# Register routes
app.include_router(api_router, tags=["Mediverse Backend Service"], prefix=f"/api/{API_VERSION}")
app.include_router(ml_router, tags=["Mediverse Machine Learning System"], prefix=f"/ml/{API_VERSION}")

origins = ["*"] if ENV == "development" else os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(f"/health", response_model=StandardResponse)
@standard_response
def health_check():
    # Check database connection
    db = Database()
    db.execute_query("SELECT 1")
    db.close_pool()
    # Check cache connection
    Cache()
    return f"Mediverse Backend Service is running with version {APP_VERSION[:7]}"

@app.exception_handler(CustomException)
async def http_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": str(exc.message),
            "data": {}
        }
    )