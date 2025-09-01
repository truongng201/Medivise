import typer
import pandas as pd
import joblib
import mlflow
import mlflow.xgboost
from config import logger
from models import train_xgb_classifier_high_recall
from pathlib import Path

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
    best_model, le, metrics, (y_test, y_pred) = train_xgb_classifier_high_recall(df_train)

    # Log with MLflow
    with mlflow.start_run() as run:
        for param, value in metrics["best_params"].items():
            mlflow.log_param(param, value)

        mlflow.log_metric("accuracy", metrics["test_accuracy"])
        mlflow.log_metric("f1_score", metrics["test_f1"])
        mlflow.log_metric("recall_high", metrics["test_recall_high"])

        mlflow.xgboost.log_model(
            best_model,
            artifact_path="model",
            registered_model_name="ehr_xgb_model"
        )

        logger.info(f"Model logged to MLflow (run_id={run.info.run_id})")

    # Save locally too
    Path("mlops/models").mkdir(parents=True, exist_ok=True)
    joblib.dump(best_model, MODEL_FILE)
    joblib.dump(le, LABEL_ENCODER_FILE)

    logger.info(f"Model saved to {MODEL_FILE}")
    logger.info(f"Label encoder saved to {LABEL_ENCODER_FILE}")
    logger.info("Training metrics:")
    for k, v in metrics.items():
        logger.info(f"{k}: {v}")


if __name__ == "__main__":
    app()