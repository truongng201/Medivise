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
        for idx, label in enumerate(labels):
            results.append({
                "record_index": idx,
                "risk_level": label
            })
            
        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(preprocessed_df)
            proba_cols = [f"proba_{cls.lower()}" for cls in self.ml_core.label_encoder.classes_]
            for i, row in enumerate(probabilities):
                for j, col in enumerate(proba_cols):
                    results[i][col] = float(row[j])
        
        return {
            "results": results
        }