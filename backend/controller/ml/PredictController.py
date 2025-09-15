import pandas as pd

from models import PredictPayload
from mlcore import MLCore
from utils import BadRequestException

class PredictController:
    def __init__(self, predict_payload: PredictPayload, ml_core: MLCore):
        if not ml_core or not ml_core.get_model():
            raise BadRequestException("MLCore instance is not initialized or model is not loaded.")
        self.ml_core = ml_core
        self.predict_payload = predict_payload
        self.artifact_model = ml_core.get_artifact_model()
        self.model = ml_core.get_model()

    def execute(self):
        # Convert list of FeatureRecord to DataFrame
        records = []
        for record in self.predict_payload.records:
            records.append(record.model_dump())
        df = pd.DataFrame(records)
        
        if df.empty:
            raise BadRequestException("Input records are empty.")
        
        preprocessed_df = self.ml_core.preprocess_for_inference(df, self.artifact_model['feature_columns'])

        predictions = self.model.predict(preprocessed_df)
        labels = self.ml_core.label_encoder.inverse_transform(predictions)
        
        results = []
        
        # Get probabilities first
        probabilities = None
        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(preprocessed_df)
            
        for idx, label in enumerate(labels):
            result = {
                "record_index": idx,
            }
            
            # Map risk level to health score and calculate score number
            if label.lower() == "low":
                result["health_score"] = "good"
                # Find proba_low and calculate score as 1 - proba_low
                if probabilities is not None:
                    proba_cols = [cls.lower() for cls in self.ml_core.label_encoder.classes_]
                    for j, cls in enumerate(self.ml_core.label_encoder.classes_):
                        result[f"proba_{cls.lower()}"] = float(probabilities[idx][j])
                    if "high" in proba_cols:
                        high_idx = proba_cols.index("high")
                        proba_high = float(probabilities[idx][high_idx])
                        result["score_number"] = 1 - proba_high
                    else:
                        result["score_number"] = 0.5  # Default fallback
                else:
                    result["score_number"] = 0.5  # Default if no probabilities
            elif label.lower() == "moderate":
                result["health_score"] = "average"
                if probabilities is not None:
                    proba_cols = [cls.lower() for cls in self.ml_core.label_encoder.classes_]
                    for j, cls in enumerate(self.ml_core.label_encoder.classes_):
                        result[f"proba_{cls.lower()}"] = float(probabilities[idx][j])
                    if "high" in proba_cols:
                        high = proba_cols.index("high")
                        proba_high = float(probabilities[idx][high])
                        result["score_number"] = 1 - proba_high
                    else:
                        result["score_number"] = 0.5  # Default fallback
                else:
                    result["score_number"] = 0.5  # Default if no probabilities
            elif label.lower() == "high":
                result["health_score"] = "poor"
                if probabilities is not None:
                    proba_cols = [cls.lower() for cls in self.ml_core.label_encoder.classes_]
                    for j, cls in enumerate(self.ml_core.label_encoder.classes_):
                        result[f"proba_{cls.lower()}"] = float(probabilities[idx][j])
                    if "high" in proba_cols:
                        high_idx = proba_cols.index("high")
                        proba_high = float(probabilities[idx][high_idx])
                        result["score_number"] = 1 - proba_high
                    else:
                        result["score_number"] = 0.5  # Default fallback
                else:
                    result["score_number"] = 0.5  # Default if no probabilities
            else:
                # For non-low risk levels, keep original risk_level format
                # You can extend this logic for moderate/high risk levels
                result["risk_level"] = label
                if probabilities is not None:
                    for j, cls in enumerate(self.ml_core.label_encoder.classes_):
                        result[f"proba_{cls.lower()}"] = float(probabilities[idx][j])
            
            results.append(result)
        
        return {
            "results": results
        }