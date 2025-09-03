# evaluate.py
import typer
import json
import numpy as np
import pandas as pd
import mlflow
import mlflow.xgboost
from typing import Dict, Any, List, Optional
from mlflow.tracking import MlflowClient
from sklearn.metrics import precision_recall_fscore_support
from sklearn.preprocessing import LabelEncoder

from config import configure_experiment, logger

app = typer.Typer()

# ---------------- Metrics helpers ----------------
def get_overall_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
    p, r, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="weighted", zero_division=0
    )
    return {
        "precision_weighted": float(p),
        "recall_weighted": float(r),
        "f1_weighted": float(f1),
        "support": int(len(y_true)),
    }

def get_per_class_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: Optional[List[str]] = None,
    labels: Optional[np.ndarray] = None,
) -> List[Dict[str, Any]]:
    if labels is None:
        labels = np.unique(np.concatenate([y_true, y_pred]))
    p, r, f1, s = precision_recall_fscore_support(
        y_true, y_pred, labels=labels, zero_division=0, average=None
    )
    rows = []
    for i, lab in enumerate(labels):
        name = (
            class_names[lab]
            if class_names is not None and 0 <= lab < len(class_names)
            else str(lab)
        )
        rows.append(
            {
                "class": name,
                "precision": float(p[i]),
                "recall": float(r[i]),
                "f1": float(f1[i]),
                "support": int(s[i]),
                "label_id": int(lab),
            }
        )
    rows.sort(key=lambda x: (x["f1"], x["support"]), reverse=True)
    return rows

# ---------------- MLflow helpers ----------------
def _load_model_and_artifacts(model_uri: str):
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
    return model, le, feature_columns, {"model_name": name, "model_version": mv.version, "run_id": run_id}

def _preprocess_for_inference(df: pd.DataFrame, feature_columns: List[str]) -> pd.DataFrame:
    X = pd.get_dummies(df, drop_first=False)
    X = X.apply(pd.to_numeric, errors="coerce")
    num_cols = X.select_dtypes(include=["number"]).columns
    X[num_cols] = X[num_cols].astype("float64")
    X = X.reindex(columns=feature_columns, fill_value=0.0)
    X = X.fillna(0.0)
    return X

# ---------------- CLI ----------------
@app.command()
def evaluate(
    data_fp: str = typer.Option("mlops/data/processed/test_patient_features.csv", help="CSV with labels"),
    label_col: str = typer.Option("risk_level", help="Label column name"),
    model_uri: str = typer.Option("models:/ehr_xgb_model/2", help="MLflow model URI"),
    output_json: str = typer.Option(None, help="Optional: save metrics JSON"),
):
    # Ensure experiment is set (even if we don't log metrics here, keeps runs consistent)
    exp = configure_experiment()
    logger.info(f"Using MLflow experiment: {exp}")

    df = pd.read_csv(data_fp)
    if label_col not in df.columns:
        raise ValueError(f"Label column '{label_col}' not in data")

    # Load model + artifacts
    model, le, feature_columns, meta = _load_model_and_artifacts(model_uri)

    y_true = le.transform(df[label_col].values)
    X = _preprocess_for_inference(df.drop(columns=[label_col]), feature_columns)
    y_pred = model.predict(X)

    overall = get_overall_metrics(y_true, y_pred)
    per_class = get_per_class_metrics(y_true, y_pred, class_names=list(le.classes_))

    print("=== Model Info ===")
    print(meta)
    print("\n=== Overall Metrics ===")
    print(
        f"Precision={overall['precision_weighted']:.4f} "
        f"Recall={overall['recall_weighted']:.4f} "
        f"F1={overall['f1_weighted']:.4f} "
        f"Support={overall['support']}"
    )
    print("\n=== Per-Class Metrics (sorted by F1) ===")
    for row in per_class:
        print(
            f"{row['class']:>15} | "
            f"P={row['precision']:.3f} R={row['recall']:.3f} "
            f"F1={row['f1']:.3f} support={row['support']}"
        )

    results = {"model": meta, "overall": overall, "per_class": per_class}
    if output_json:
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\nSaved metrics to {output_json}")

if __name__ == "__main__":
    app()