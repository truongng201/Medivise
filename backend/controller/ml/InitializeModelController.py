from mlcore import MLCore

class InitializeModelController:
    def __init__(self, ml_core: MLCore):
        self.ml_core = ml_core

    def execute(self):
        self.ml_core.load_model()
        self.ml_core.load_artifacts()