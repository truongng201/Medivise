import typer
import pandas as pd
import joblib
import mlflow
import mlflow.xgboost
from config import logger
from models import train_xgb_classifier_high_recall
from pathlib import Path
import json, numpy as np, pandas as pd
from mlflow.models.signature import infer_signature
from sklearn.preprocessing import LabelEncoder
from mlflow.tracking import MlflowClient

# Constants
TRAIN_FILE = "mlops/data/processed/train_patient_features.csv"
MODEL_FILE = "mlops/models/xgb_model.pkl"
LABEL_ENCODER_FILE = "mlops/models/label_encoder.pkl"

app = typer.Typer()

@app.command()
def train():
    logger.info("Loading training data...")
    df_train = pd.read_csv(TRAIN_FILE)

    logger.info("Training XGBoost model...")
    best_model, le, metrics, (y_test, y_pred), feature_columns = train_xgb_classifier_high_recall(df_train)
    logger.info("Training complete.")

    # Log with MLflow
    with mlflow.start_run() as run:
        # Log params
        for param, value in metrics["best_params"].items():
            mlflow.log_param(param, value)

        # Log metrics
        mlflow.log_metric("accuracy", metrics["test_accuracy"])
        mlflow.log_metric("f1_score", metrics["test_f1"])
        mlflow.log_metric("recall_high", metrics["test_recall_high"])

        # Log model
        sample_X = pd.get_dummies(df_train.drop(columns=["risk_level"]))
        sample_X = sample_X.apply(pd.to_numeric, errors="coerce")
        # Reindex to ensure same feature order as training and fill missing columns with median
        sample_X = sample_X.reindex(columns=feature_columns)
        sample_X = sample_X.apply(lambda col: col.fillna(col.median()))
        sample_X = sample_X.reindex(columns=feature_columns, fill_value=0)
        # Convert integer columns to float64 to avoid MLflow warning about integer columns with missing values
        int_cols = sample_X.select_dtypes(include=["int8", "int16", "int32", "int64"]).columns
        if len(int_cols) > 0:
            sample_X[int_cols] = sample_X[int_cols].astype("float64")
        sample_X = sample_X.apply(lambda col: col.fillna(col.median()))

        sig = infer_signature(sample_X.iloc[:5], best_model.predict_proba(sample_X.iloc[:5]))

        mlflow.xgboost.log_model(
            best_model,
            name="model",
            registered_model_name="ehr_xgb_model",
            signature=sig,
            input_example=sample_X.iloc[:3]
        )
        
        # 2) Log artifacts
        mlflow.log_dict({"feature_columns": feature_columns}, artifact_file="artifacts/feature_columns.json")
        mlflow.log_dict({"classes": le.classes_.tolist()}, artifact_file="artifacts/label_classes.json")

        booster = best_model.get_booster()
        booster.save_model("mlops/models/model.json")
        mlflow.log_artifact("mlops/models/model.json", artifact_path="artifacts")

        logger.info(f"Model + LabelEncoder logged to MLflow (run_id={run.info.run_id})")

    # Save locally too (optional, can be removed later)
    joblib.dump(best_model, MODEL_FILE)
    joblib.dump(le, LABEL_ENCODER_FILE)
    logger.info("Training metrics:")
    for k, v in metrics.items():
        logger.info(f"{k}: {v}")


if __name__ == "__main__":
    app()
