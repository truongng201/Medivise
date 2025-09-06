from mlcore import MLCore
from utils import BadRequestException

class TrainModelController:
    def __init__(self, ml_core: MLCore):
        self.response = None
        self.ml_core = ml_core
        if not self.ml_core:
            raise BadRequestException("MLCore instance is not initialized.")
        
    def execute(self):
        self.response = "This endpoint will trigger model training once implemented"