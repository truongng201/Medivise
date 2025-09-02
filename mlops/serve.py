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

# ---------- Feature schema ----------
class FeatureRecord(BaseModel):
    gender: str
    race: str
    ethnicity: str
    pain_severity: str
    tobacco_smoking_status: str
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
MODEL_URI = os.getenv("MODEL_URI", "models:/ehr_xgb_model/1")
CONFIDENCE_THRESHOLD = float(os.getenv("PRED_THRESHOLD", "0.0"))

# Storage for global resources
_resources: Dict[str, Any] = {}

# ---------- Helpers ----------
def _preprocess_for_inference(df: pd.DataFrame, feature_columns: List[str]) -> pd.DataFrame:
    X = pd.get_dummies(df, drop_first=False)
    X = X.apply(pd.to_numeric, errors="coerce")
    num_cols = X.select_dtypes(include=["number"]).columns
    X[num_cols] = X[num_cols].astype("float64")
    X = X.reindex(columns=feature_columns, fill_value=0.0)
    X = X.fillna(0.0)
    return X

def _load_model_and_artifacts(model_uri: str):
    model = mlflow.xgboost.load_model(model_uri)
    client = MlflowClient()

    _, name, alias_or_version = model_uri.split("/", 2)
    try:
        mv = client.get_model_version_by_alias(name, alias_or_version)
    except Exception:
        mv = client.get_model_version(name, alias_or_version)
    run_id = mv.run_id

    feat_path = client.download_artifacts(run_id, "artifacts/feature_columns.json")
    cls_path  = client.download_artifacts(run_id, "artifacts/label_classes.json")

    feature_columns = json.load(open(feat_path))["feature_columns"]
    classes = np.array(json.load(open(cls_path))["classes"])

    le = LabelEncoder()
    le.classes_ = classes

    meta = {"model_name": name, "model_version": mv.version, "run_id": run_id}
    return model, le, feature_columns, meta

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
    if "model" not in _resources or "label_encoder" not in _resources:
        raise HTTPException(status_code=500, detail="Model not loaded")

    df = pd.DataFrame([r.model_dump() for r in payload.records])
    X = _preprocess_for_inference(df, _resources["feature_columns"])
    model = _resources["model"]
    le = _resources["label_encoder"]

    preds = model.predict(X)
    labels = le.inverse_transform(preds)

    results: List[Dict[str, Any]] = []
    probs = model.predict_proba(X) if hasattr(model, "predict_proba") else None
    classes = list(le.classes_)
    use_other = CONFIDENCE_THRESHOLD > 0 and ("other" in classes) and (probs is not None)

    for i in range(len(X)):
        item: Dict[str, Any] = {"prediction": str(labels[i])}
        if probs is not None:
            proba_map = {str(classes[j]): float(probs[i, j]) for j in range(len(classes))}
            item["probabilities"] = proba_map
            if use_other:
                pred_label = str(labels[i])
                if proba_map.get(pred_label, 0.0) < CONFIDENCE_THRESHOLD:
                    item["prediction"] = "other"
        results.append(item)

    return {"results": results}

# ---------- Local run ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))