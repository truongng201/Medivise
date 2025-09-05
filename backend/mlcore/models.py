import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, make_scorer, recall_score
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import f1_score


def train_xgb_classifier_high_recall(
    df: pd.DataFrame,
    label: str = "risk_level",
    high_label_name: str = "High",
    random_state: int = 69
):
    """Train XGBoost model optimized for recall on the 'High' risk class."""
    # Encode target
    le = LabelEncoder()
    y = le.fit_transform(df[label])
    high_index = np.where(le.classes_ == high_label_name)[0][0]

    # Features
    X = df.drop(columns=[label])
    X = pd.get_dummies(X)
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)
    feature_columns = X.columns.tolist()
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_state, stratify=y
    )

    # Base model
    xgb_clf = XGBClassifier(
        random_state=random_state,
        tree_method="hist",
        eval_metric="mlogloss",
    )

    # Hyperparameter grid
    param_grid = {
        "n_estimators": [300, 500, 700],
        "max_depth": [4, 6, 8],
        "learning_rate": [0.01, 0.005, 0.001],
        "subsample": [0.8, 1.0],
        "colsample_bytree": [0.8, 1.0],
    }

    # Custom scorer (recall of High class only)
    def high_recall_scorer(y_true, y_pred):
        recalls = recall_score(y_true, y_pred, average=None, labels=np.unique(y_true))
        return recalls[high_index]

    scorer = make_scorer(high_recall_scorer, greater_is_better=True)

    # Grid search
    grid_search = GridSearchCV(
        estimator=xgb_clf,
        param_grid=param_grid,
        scoring=scorer,
        cv=3,
        verbose=1,
        n_jobs=-1,
    )
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)

    metrics = {
        "best_params": grid_search.best_params_,
        "best_cv_high_recall": grid_search.best_score_,
        "test_accuracy": accuracy_score(y_test, y_pred),
        "test_f1": f1_score(y_test, y_pred, average="weighted"),
        "test_recall_high": recall_score(y_test, y_pred, average=None)[high_index],
        "classification_report": classification_report(y_test, y_pred, target_names=le.classes_),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
    }

    return best_model, le, metrics, (y_test, y_pred), feature_columns