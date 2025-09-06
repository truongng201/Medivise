from fastapi import APIRouter

from controller import InitializeModelController, GetModelMetadataController, TrainModelController
from utils import standard_response

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
def predict():
    return "This endpoint will return predictions results once implemented"


@ml_router.post("/train_model")
@standard_response
def train_model():
    controller = TrainModelController(ml_core)
    controller.execute()
    return "Tra"


@ml_router.post("/evaluate_model")
@standard_response
def evaluate_model():
    return "This endpoint will trigger model evaluation once implemented"

