import joblib
import pandas as pd
import typer
from config import logger

app = typer.Typer()

MODEL_FILE = "mlops/models/xgb_model.pkl"


@app.command()
def predict(model_fp: str = MODEL_FILE, data_fp: str = "data/processed/test_patient_features.csv", proba: bool = True):
    """
    Predict risk levels for new patient data.

    Args:
        model_fp (str): path to saved model (.pkl).
        data_fp (str): path to patient features CSV.
        proba (bool): whether to include class probabilities in output.
    """
    # Load model + encoder
    bundle = joblib.load(model_fp)
    model, le = bundle["model"], bundle["label_encoder"]

    # Load data
    df = pd.read_csv(data_fp)
    X = pd.get_dummies(df)
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)

    # Predictions
    preds = model.predict(X)
    labels = le.inverse_transform(preds)

    results = pd.DataFrame({"prediction": labels})

    if proba:
        probs = model.predict_proba(X)
        prob_df = pd.DataFrame(probs, columns=[f"proba_{cls}" for cls in le.classes_])
        results = pd.concat([results, prob_df], axis=1)

    logger.info(f"Sample predictions:\n{results.head()}")
    return results


if __name__ == "__main__":
    app()