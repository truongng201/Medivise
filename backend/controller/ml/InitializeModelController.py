from mlcore import MLCore
from utils import BadRequestException

class InitializeModelController:
    def __init__(self, ml_core: MLCore):
        if ml_core:
            raise BadRequestException("Model is already initialized.")
        self.ml_core = MLCore()
        

    def execute(self):
        self.ml_core.load_model()
        self.ml_core.load_artifacts()
        return self.ml_core