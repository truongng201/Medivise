import joblib
import typer
import pandas as pd
import subprocess
from models import train_xgb_classifier_high_recall
from config import logger
import os

app = typer.Typer()

# File locations
TRAIN_FILE = "mlops/data/processed/train_patient_features.csv"
MODEL_FILE = "mlops/models/xgb_model.pkl"
LABEL_ENCODER_FILE = "mlops/models/label_encoder.pkl"

# Ensure the model directory exists
model_dir = os.path.dirname(MODEL_FILE)
os.makedirs(model_dir, exist_ok=True)


@app.command()
def train(data_fp: str = TRAIN_FILE, model_fp: str = MODEL_FILE, le_fp: str = LABEL_ENCODER_FILE, label: str = "risk_level"):
    """
    Run data preprocessing (data.py), then train XGB classifier on training data and save model.
    """
    # --- Step 1: Run data.py to regenerate train/test CSVs ---
    logger.info("INFO Running data preprocessing pipeline (data.py)...")
    subprocess.run(["python", "mlops/data.py"], check=True)

    # --- Step 2: Load training data ---
    df = pd.read_csv(data_fp)
    logger.info(f"Loaded training data with {len(df)} rows.")

    # --- Step 3: Train model ---
    best_model, le, metrics, _ = train_xgb_classifier_high_recall(df, label=label)

    # --- Step 4: Save model + label encoder ---
    joblib.dump(best_model, model_fp)
    joblib.dump(le, le_fp)

    logger.info(f"SUCCESS Model saved to {model_fp}")
    logger.info("Training metrics:")
    for k, v in metrics.items():
        logger.info(f"{k}: {v}")


if __name__ == "__main__":
    app()