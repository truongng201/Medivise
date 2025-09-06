import os
import mlflow
import json
import numpy as np
import pandas as pd
from typing import List
from sklearn.preprocessing import LabelEncoder

from utils import BadRequestException

class MLCore:
    def __init__(self):
        self.mlflow_tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5001")
        self.default_experiment_name = os.getenv("MLFLOW_EXPERIMENT_NAME", "ehr_xgb_experiment")
        self.model_uri = os.getenv("MODEL_URI", "models:/ehr_xgb_model/1")
        self.confidence_threshold = float(os.getenv("PRED_THRESHOLD", "0.0"))

        self.model = None
        self.mlflow_client = None
        self.artifact_model = None
        self.model_metadata = None
        self.label_encoder = None

        self._set_tracking_uri()
        self._configure_experiment()
        self._set_mlflow_client()


    def _set_tracking_uri(self):
        mlflow.set_tracking_uri(self.mlflow_tracking_uri)
        
        
    def _configure_experiment(self):
        mlflow.set_experiment(self.default_experiment_name)
        
    
    def _set_mlflow_client(self):
        self.mlflow_client = mlflow.tracking.MlflowClient()
        
        
    def _set_model_metadata(self):
        _, model_name, model_version_or_alias = self.model_uri.split("/", 2)
        
        # Version is digit, alias is string. Example: 1, 2, 3... or Production, Staging, etc.
        
        if model_version_or_alias.isdigit():
            model_version = self.mlflow_client.get_model_version(model_name, model_version_or_alias)
        else:
            model_version = self.mlflow_client.get_model_version_by_alias(model_name, model_version_or_alias)

        if not model_version:
            raise BadRequestException(f"Model version or alias '{model_version_or_alias}' not found for model '{model_name}'")
            
        self.model_metadata = {
            "model_name": model_name,
            "model_version": model_version.version,
            "model_run_id": model_version.run_id,
            "model_source": model_version.source,
            "model_status": model_version.status,
        }
        
    def get_model(self):
        return self.model
        
    
    def get_model_metadata(self):
        return self.model_metadata
    
    
    def get_artifact_model(self):
        return self.artifact_model
        
        
    def load_artifacts(self):
        if not self.model_metadata:
            raise BadRequestException("Model metadata is not set. Please load the model first.")
        
        features_column_path = self.mlflow_client.download_artifacts(self.model_metadata["model_run_id"], "artifacts/feature_columns.json")
        label_classes_path = self.mlflow_client.download_artifacts(self.model_metadata["model_run_id"], "artifacts/label_classes.json")

        feature_columns = json.load(open(features_column_path))["feature_columns"]
        label_classes = np.array(json.load(open(label_classes_path))["classes"])
        
        self.label_encoder = LabelEncoder()
        self.label_encoder.classes_ = label_classes
        
        self.artifact_model = {
            "feature_columns": feature_columns,
            "label_classes": label_classes
        }


    def load_model(self):
        self.model = mlflow.xgboost.load_model(self.model_uri)
        self._set_model_metadata()
        
        
    def preprocess_for_inference(self, df: pd.DataFrame, feature_columns: List[str]) -> pd.DataFrame:
        """
        EXACT same steps as train/evaluate:
        - get_dummies (no drop_first)
        - numeric coercion
        - cast all numeric to float64
        - reindex to feature_columns with fill_value=0.0
        - final fillna(0.0)
        """
        X = pd.get_dummies(df, drop_first=False)
        X = X.apply(pd.to_numeric, errors="coerce")
        num_cols = X.select_dtypes(include=["number"]).columns
        X[num_cols] = X[num_cols].astype("float64")
        X = X.reindex(columns=feature_columns, fill_value=0.0)
        X = X.fillna(0.0)
        return X