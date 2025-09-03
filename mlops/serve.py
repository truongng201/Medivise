# serve.py
import os
import json
from typing import Any, Dict, List, Optional
from contextlib import asynccontextmanager
from http import HTTPStatus
import numpy as np
import pandas as pd
import mlflow
import mlflow.xgboost
from mlflow.tracking import MlflowClient
from sklearn.preprocessing import LabelEncoder
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from config import configure_experiment, logger
from predict import _load_model_and_artifacts, _preprocess_for_inference

class FeatureRecord(BaseModel):
    gender: str
    race: str
    ethnicity: str
    tobacco_smoking_status: str
    pain_severity: Optional[float] = None
    age: Optional[float] = None
    bmi: Optional[float] = None
    calcium: Optional[float] = None
    carbon_dioxide: Optional[float] = None
    chloride: Optional[float] = None
    creatinine: Optional[float] = None
    diastolic_bp: Optional[float] = None
    glucose: Optional[float] = None
    heart_rate: Optional[float] = None
    potassium: Optional[float] = None
    respiratory_rate: Optional[float] = None
    sodium: Optional[float] = None
    systolic_bp: Optional[float] = None
    urea_nitrogen: Optional[float] = None

class PredictPayload(BaseModel):
    records: List[FeatureRecord] = Field(..., description="List of patient feature records")

# ---------- Config ----------
MODEL_URI = os.getenv("MODEL_URI", "models:/ehr_xgb_model/2")
CONFIDENCE_THRESHOLD = float(os.getenv("PRED_THRESHOLD", "0.0"))

# Storage for global resources
_resources: Dict[str, Any] = {}

# ---------- Lifespan ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    exp = configure_experiment()
    logger.info(f"Starting API with MLflow experiment: {exp}")

    model, le, feature_columns, meta = _load_model_and_artifacts(MODEL_URI)
    _resources["model"] = model
    _resources["label_encoder"] = le
    _resources["feature_columns"] = feature_columns
    _resources["meta"] = meta

    logger.info(f"Loaded model: {meta}")
    yield
    # Cleanup
    _resources.clear()

app = FastAPI(
    title="EHR Risk Level Prediction API",
    description="XGBoost model served from MLflow Registry",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------- Routes ----------
@app.get("/")
def health():
    """Health check."""
    response = {
        "message": HTTPStatus.OK.phrase,
        "status-code": HTTPStatus.OK,
        "data": {},
    }
    return response

@app.get("/meta")
def meta():
    return {
        "model": _resources.get("meta"),
        "num_feature_columns": len(_resources.get("feature_columns", [])),
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "has_other_class": "other" in list(_resources["label_encoder"].classes_)
        if "label_encoder" in _resources else False,
    }

@app.post("/predict")
def predict(payload: PredictPayload):
    # Convert incoming records to DataFrame
    df = pd.DataFrame([r.model_dump() for r in payload.records])
    if df.empty:
        return {"model": _resources["meta"], "results": []}

    # Preprocess with the **same** steps as train/evaluate/predict
    X = _preprocess_for_inference(df, _resources["feature_columns"])

    # Predict
    preds = _resources["model"].predict(X)
    labels = _resources["label_encoder"].inverse_transform(preds)

    results: List[Dict[str, Any]] = [{"prediction": str(lbl)} for lbl in labels]

    # Probabilities (if supported)
    if hasattr(_resources["model"], "predict_proba"):
        probs = _resources["model"].predict_proba(X)
        proba_cols = [f"proba_{c}" for c in _resources["label_encoder"].classes_]
        for i, row in enumerate(probs):
            results[i].update({proba_cols[j]: float(row[j]) for j in range(len(proba_cols))})

    return {"model": _resources["meta"], "results": results}

# ---------- Local run ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))