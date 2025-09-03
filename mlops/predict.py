# predict.py
import typer
import json
import numpy as np
import pandas as pd
import mlflow
import mlflow.xgboost
from typing import Dict, Any, List, Optional
from mlflow.tracking import MlflowClient
from sklearn.preprocessing import LabelEncoder

from config import configure_experiment, logger

app = typer.Typer()

# ---------------- MLflow helpers ----------------
def _load_model_and_artifacts(model_uri: str):
    """
    Load XGBoost model from MLflow Model Registry and fetch side artifacts:
    - artifacts/feature_columns.json
    - artifacts/label_classes.json
    Supports both alias and numeric version in the model URI.
    """
    model = mlflow.xgboost.load_model(model_uri)

    client = MlflowClient()
    # models:/<name>/<alias_or_version>
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

# ---------------- Preprocessing ----------------
def _preprocess_for_inference(df: pd.DataFrame, feature_columns: List[str]) -> pd.DataFrame:
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

# ---------------- CLI ----------------
@app.command()
def predict(
    data_fp: str = typer.Option("mlops/data/processed/test_patient_features.csv", help="CSV for inference (no label column required)"),
    model_uri: str = typer.Option("models:/ehr_xgb_model/2", help="MLflow model URI (alias or version)"),
    output_csv: Optional[str] = typer.Option(None, help="Optional path to save predictions as CSV"),
    output_json: Optional[str] = typer.Option(None, help="Optional path to save predictions as JSON"),
    show_head: int = typer.Option(10, help="Print first N rows of predictions to console"),
):
    """
    Batch prediction from CSV. Produces 'prediction' and (if available) per-class probabilities.
    """
    # Ensure experiment is set (keeps environment consistent with train/evaluate)
    exp = configure_experiment()
    logger.info(f"Using MLflow experiment: {exp}")

    # Load data
    df = pd.read_csv(data_fp)
    if df.empty:
        raise ValueError(f"No rows found in {data_fp}")

    # Load model + artifacts
    model, le, feature_columns, meta = _load_model_and_artifacts(model_uri)
    logger.info(f"Loaded model: {meta}")

    # Preprocess (no label column expected here)
    X = _preprocess_for_inference(df, feature_columns)

    # Predict
    preds = model.predict(X)
    labels = le.inverse_transform(preds)

    out = pd.DataFrame({"prediction": labels})

    # Probabilities (if classifier exposes predict_proba)
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(X)
        proba_cols = [f"proba_{c}" for c in le.classes_]
        proba_df = pd.DataFrame(probs, columns=proba_cols)
        out = pd.concat([out, proba_df], axis=1)

    # Echo a preview
    if show_head and show_head > 0:
        print("\n=== Model Info ===")
        print(meta)
        print(f"\n=== Predictions (head {show_head}) ===")
        print(out.head(show_head).to_string(index=False))

    # Optional saves
    if output_csv:
        out.to_csv(output_csv, index=False)
        print(f"\nSaved predictions CSV to: {output_csv}")
    if output_json:
        out.to_json(output_json, orient="records", force_ascii=False, indent=2)
        print(f"Saved predictions JSON to: {output_json}")

if __name__ == "__main__":
    app()
