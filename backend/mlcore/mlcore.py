import os
import mlflow

class MLCore:
    def __init__(self):
        self.mlflow_tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
        self.default_experiment_name = os.getenv("MLFLOW_EXPERIMENT_NAME", "ehr_xgb_experiment")
        self._set_tracking_uri()

    def _set_tracking_uri(self):
        mlflow.set_tracking_uri(self.mlflow_tracking_uri)
        
    def _configure_experiment(self, name: str) -> str:
        exp_name = name or self.default_experiment_name
        mlflow.set_experiment(exp_name)
        return exp_name