# train.py
import typer
import pandas as pd
import numpy as np
import mlflow
import mlflow.xgboost
from tempfile import TemporaryDirectory

from config import configure_experiment
from models import train_xgb_classifier_high_recall
from mlflow.models.signature import infer_signature

TRAIN_FILE = "../mldata/processed/train_patient_features.csv"

app = typer.Typer()

def _make_sample_X(df_train: pd.DataFrame, feature_columns: list[str]) -> pd.DataFrame:
    # SAME pipeline as inference
    X = pd.get_dummies(df_train.drop(columns=["risk_level"]), drop_first=False)
    X = X.apply(pd.to_numeric, errors="coerce")
    num_cols = X.select_dtypes(include=["number"]).columns
    X[num_cols] = X[num_cols].astype("float64")
    X = X.reindex(columns=feature_columns, fill_value=0.0)
    X = X.fillna(0.0)
    return X

@app.command()
def train():
    # Ensure experiment is set (uses default from config unless overridden)
    exp = configure_experiment()
    print(f"Using MLflow experiment: {exp}")

    print("Loading training data...")
    df_train = pd.read_csv(TRAIN_FILE)

    print("Training XGBoost model...")
    best_model, le, metrics, (_y_test, _y_pred), feature_columns = \
        train_xgb_classifier_high_recall(df_train)
    print("Training complete.")

    # Prepare sample for MLflow signature
    sample_X_full = _make_sample_X(df_train, feature_columns)
    n = min(len(sample_X_full), 5)
    sample_X = sample_X_full.iloc[:n] if n > 0 else sample_X_full

    sig = infer_signature(sample_X, best_model.predict_proba(sample_X))

    with mlflow.start_run() as run:
        # Log params
        for param, value in metrics.get("best_params", {}).items():
            mlflow.log_param(param, value)

        # Log metrics
        if "test_accuracy" in metrics:    mlflow.log_metric("accuracy", metrics["test_accuracy"])
        if "test_f1" in metrics:          mlflow.log_metric("f1_score", metrics["test_f1"])
        if "test_recall_high" in metrics: mlflow.log_metric("recall_high", metrics["test_recall_high"])

        # Log model (Registry)
        mlflow.xgboost.log_model(
            best_model,
            name="model",  # avoids artifact_path deprecation
            registered_model_name="ehr_xgb_model",
            signature=sig,
            input_example=sample_X.iloc[:min(3, len(sample_X))] if len(sample_X) > 0 else None,
        )

        # Side artifacts (no local persistence)
        mlflow.log_dict({"feature_columns": feature_columns}, "artifacts/feature_columns.json")
        mlflow.log_dict({"classes": le.classes_.tolist()}, "artifacts/label_classes.json")

        # Optional: log booster JSON for inspection (temp file, not kept locally)
        with TemporaryDirectory() as tmp:
            booster_json_path = f"{tmp}/model.json"
            best_model.get_booster().save_model(booster_json_path)
            mlflow.log_artifact(booster_json_path, artifact_path="artifacts")

        print(f"Model logged to MLflow (run_id={run.info.run_id})")
        print("Metrics:")
        for k, v in metrics.items():
            print(f"{k}: {v}")

if __name__ == "__main__":
    app()