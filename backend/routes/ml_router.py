from fastapi import APIRouter

from mlcore import MLCore
from controller import InitializeModelController, GetModelMetadataController
from utils import standard_response, BadRequestException

ml_router = APIRouter()
ml_core = None

@ml_router.get("/get_model_metadata")
@standard_response
def get_model_metadata():
    controller = GetModelMetadataController(ml_core)
    response = controller.execute()
    return response

@ml_router.post("/initialize_model")
@standard_response
def initialize_model():
    global ml_core
    if ml_core:
        raise BadRequestException("Model is already initialized.")
    ml_core = MLCore()
    controller = InitializeModelController(ml_core)
    controller.execute()
    return "Model initialized successfully"