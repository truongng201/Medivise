import os
import mlflow
import json
import numpy as np
import pandas as pd
from typing import List
from sklearn.preprocessing import LabelEncoder
# from groq import Groq
from dotenv import load_dotenv
import os
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
    
# class ClinicalAssistant:
#     def __init__(self, api_key=None, model="openai/gpt-oss-20b"):
#         load_dotenv()
#         self.api_key = api_key or os.getenv("GROQ_API_KEY")
#         self.client = Groq(api_key=self.api_key)
#         self.model = model

#         # System prompt
#         self.system_prompt = """
#         You are a professional clinical assistant. Your role is to support clinicians by analyzing:

#         - Model prediction
#         - Patient vitals 

#         From these inputs, generate a structured and concise set of **recommendations**, including:  
#         1. Suggested actions  
#         2. Monitoring requirements  
#         3. Red flags to watch for  

#         For each recommendation, provide clinical reasoning where appropriate.  
#         Important rules for your behavior:  
#         - Always include a clear disclaimer: these are AI-generated recommendations and must be reviewed by a licensed physician before any decisions are made.  
#         - Present information in a professional, concise, and medically accurate manner.  
#         - Do not make definitive diagnostic or treatment claims — state only facts, guidelines, or possible considerations.  
#         - After initialization, continue as a clinical assistant in a professional, cautious tone during conversation.  
#         """

#         # Initialize conversation memory
#         self.messages = [
#             {"role": "system", "content": self.system_prompt}
#         ]

#     def chat(self, user_input, stream=True, temperature=0.7, max_tokens=8192, top_p=1):
#         """Send a message to the assistant and get a reply."""
#         self.messages.append({"role": "user", "content": user_input})

#         completion = self.client.chat.completions.create(
#             model=self.model,
#             messages=self.messages,
#             temperature=temperature,
#             max_completion_tokens=max_tokens,
#             top_p=top_p,
#             stream=stream
#         )

#         assistant_reply = ""
#         if stream:
#             for chunk in completion:
#                 delta = chunk.choices[0].delta.content or ""
#                 print(delta, end="")
#                 assistant_reply += delta
#         else:
#             assistant_reply = completion.choices[0].message.content
#             print(assistant_reply)

#         # Save assistant reply
#         self.messages.append({"role": "assistant", "content": assistant_reply})

#         return assistant_reply

#     def reset_conversation(self):
#         """Reset conversation memory to system prompt only."""
#         self.messages = [{"role": "system", "content": self.system_prompt}]