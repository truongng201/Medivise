class GetModelMetadataController:
    def __init__(self):
        self.response = None
    
    def execute(self):
        self.response = {"model_name": "example_model", "version": "1.0", "accuracy": 0.95}
        return self.response