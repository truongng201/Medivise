from mlcore import MLCore
from utils import BadRequestException

class GetModelMetadataController:
    def __init__(self, ml_core: MLCore):
        self.response = None
        self.ml_core = ml_core
        if not self.ml_core:
            raise BadRequestException("MLCore instance is not initialized.")
        
    def _mapping_response(self):
        model_metadata = self.ml_core.get_model_metadata()
        artifact_model = self.ml_core.get_artifact_model()
        
        if not model_metadata or not artifact_model:
            raise BadRequestException("Model is not initialized. Please initialize the model first.")
        
        self.response = {
            "model_metadata": model_metadata,
            "total_feature_columns": len(artifact_model.get("feature_columns", [])),
            "confidence_threshold": self.ml_core.confidence_threshold,
            "has_other_class": "other" in list(artifact_model.get("label_classes", [])),
        }
    
    def execute(self):
        self._mapping_response()
        return self.response