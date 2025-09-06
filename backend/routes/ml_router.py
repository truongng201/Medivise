from fastapi import APIRouter

from controller import InitializeModelController, GetModelMetadataController, PredictController
from utils import standard_response
from models import PredictPayload

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
    controller = InitializeModelController(ml_core)
    ml_core = controller.execute()
    return "Model initialized successfully"

@ml_router.post("/predict")
@standard_response
def predict(request_payload: PredictPayload):
    controller = PredictController(request_payload, ml_core)
    response = controller.execute()
    return response