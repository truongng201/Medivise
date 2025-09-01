import joblib
import pandas as pd
import typer
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    recall_score,
)
from config import logger

app = typer.Typer()

TEST_FILE = "mlops/data/processed/test_patient_features.csv"
MODEL_FILE = "mlops/models/xgb_model.pkl"
LABEL_ENCODER_FILE = "mlops/models/label_encoder.pkl"

@app.command()
def evaluate(model_fp: str = MODEL_FILE, le_fp: str = LABEL_ENCODER_FILE,  data_fp: str = TEST_FILE, label: str = "risk_level", high_label_name: str = "High"):
    """Evaluate trained model on the held-out test set."""
    # Load model + encoder
    model = joblib.load(model_fp)
    le = joblib.load(le_fp)

    # Load test set
    df = pd.read_csv(data_fp)
    y_true = le.transform(df[label])
    X = df.drop(columns=[label])
    X = pd.get_dummies(X)
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)

    # Predictions
    y_pred = model.predict(X)
    y_prob = model.predict_proba(X)

    # Metrics
    high_index = list(le.classes_).index(high_label_name)
    acc = accuracy_score(y_true, y_pred)
    high_recall = recall_score(y_true, y_pred, average=None)[high_index]

    # Desired order
    desired_order = ["High", "Moderate", "Low"]
    order_indices = [list(le.classes_).index(c) for c in desired_order]
    
    logger.info("Test Set Evaluation")
    logger.info(f"Accuracy: {acc:.4f}")
    logger.info(f"Recall ({high_label_name}): {high_recall:.4f}")
    report = classification_report(y_true, y_pred,
                                    labels=order_indices,
                                    target_names=desired_order)
    logger.info("\nClassification Report:\n%s", report)
    cm = confusion_matrix(y_true, y_pred, labels=order_indices)
    logger.info("\nConfusion Matrix:\n%s", cm)

    # Per-class probability averages
    logger.info("\nAverage Predicted Probabilities by True Class:")
    for i, cls in enumerate(le.classes_):
        mask = y_true == i
        if mask.sum() == 0:
            continue
        avg_probs = y_prob[mask].mean(axis=0)
        logger.info(f"\nTrue Class = {cls}")
        for j, pred_cls in enumerate(le.classes_):
            logger.info(f"  P({pred_cls}) = {avg_probs[j]:.3f}")


if __name__ == "__main__":
    app()