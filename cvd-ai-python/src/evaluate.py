from __future__ import annotations

from pathlib import Path
import pickle
import warnings

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import train_test_split


warnings.filterwarnings("ignore")

PROJECT_ROOT = Path(__file__).resolve().parents[2]
ML_ROOT = PROJECT_ROOT / "cvd-ai-python"
X_DATASET_PATH = ML_ROOT / "data" / "processed" / "X_dataset.csv"
Y_DATASET_PATH = ML_ROOT / "data" / "processed" / "Y_dataset.csv"
MODEL_DIR = ML_ROOT / "Trained_Models"
VISUALS_DIR = ML_ROOT / "VisualizedImages"

MODEL_FILES = {
    "Decision Tree": "decisionTreeModel.pkl",
    "Random Forest": "randomForestModel.pkl",
    "Logistic Regression": "logisticRegressionModel.pkl",
    "SVM": "svmModel.pkl",
    "KNN": "knnModel_Tuned.pkl",
}


def _score_values(model: object, x_df: pd.DataFrame):
    if hasattr(model, "predict_proba"):
        return model.predict_proba(x_df)[:, 1]
    if hasattr(model, "decision_function"):
        return model.decision_function(x_df)
    return model.predict(x_df)


def run() -> None:
    if not X_DATASET_PATH.exists() or not Y_DATASET_PATH.exists():
        raise FileNotFoundError("Processed datasets are missing. Run src/data_preprocess.py first.")

    VISUALS_DIR.mkdir(parents=True, exist_ok=True)
    x_df = pd.read_csv(X_DATASET_PATH)
    y_df = pd.read_csv(Y_DATASET_PATH).iloc[:, 0].astype(int)

    _x_train, x_test, _y_train, y_test = train_test_split(
        x_df, y_df, test_size=0.2, random_state=4
    )

    metrics_rows = []
    roc_rows = []
    best_model_name = ""
    best_model_auc = -1.0
    best_model_preds = None

    for model_name, model_filename in MODEL_FILES.items():
        model_path = MODEL_DIR / model_filename
        if not model_path.exists():
            continue

        with model_path.open("rb") as model_file:
            model = pickle.load(model_file)

        y_pred = model.predict(x_test)
        y_scores = _score_values(model, x_test)

        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_scores)

        metrics_rows.append(
            {
                "model": model_name,
                "accuracy": round(accuracy, 4),
                "precision": round(precision, 4),
                "recall": round(recall, 4),
                "f1": round(f1, 4),
                "roc_auc": round(roc_auc, 4),
            }
        )

        fpr, tpr, _ = roc_curve(y_test, y_scores)
        roc_rows.append((model_name, fpr, tpr, roc_auc))

        if roc_auc > best_model_auc:
            best_model_auc = roc_auc
            best_model_name = model_name
            best_model_preds = y_pred

        if model_name == "Random Forest" and hasattr(model, "feature_importances_"):
            importance = pd.Series(model.feature_importances_, index=x_df.columns).sort_values(ascending=False)
            plt.figure(figsize=(10, 6))
            sns.barplot(x=importance.head(10).values, y=importance.head(10).index, hue=importance.head(10).index, dodge=False, legend=False)
            plt.title("Top 10 Features by Random Forest Importance")
            plt.xlabel("Importance")
            plt.ylabel("Feature")
            plt.tight_layout()
            plt.savefig(VISUALS_DIR / "feature_importance_random_forest.png", dpi=200)
            plt.close()

    if not metrics_rows:
        raise RuntimeError("No model metrics were generated. Check Trained_Models contents.")

    metrics_df = pd.DataFrame(metrics_rows).sort_values(by="roc_auc", ascending=False)
    metrics_df.to_csv(VISUALS_DIR / "model_metrics.csv", index=False)

    plt.figure(figsize=(8, 6))
    for model_name, fpr, tpr, roc_auc in roc_rows:
        plt.plot(fpr, tpr, label=f"{model_name} (AUC={roc_auc:.3f})")
    plt.plot([0, 1], [0, 1], linestyle="--", color="gray")
    plt.title("ROC Curves for Saved CVD Models")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "roc_curve.png", dpi=200)
    plt.close()

    if best_model_preds is not None:
        cm = confusion_matrix(y_test, best_model_preds)
        plt.figure(figsize=(6, 5))
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            cbar=False,
            xticklabels=["Pred 0", "Pred 1"],
            yticklabels=["Actual 0", "Actual 1"],
        )
        plt.title(f"Confusion Matrix ({best_model_name})")
        plt.xlabel("Predicted")
        plt.ylabel("Actual")
        plt.tight_layout()
        plt.savefig(VISUALS_DIR / "confusion_matrix_best_model.png", dpi=200)
        plt.close()

    print(metrics_df.to_string(index=False))
    print(f"\nSaved metrics and plots to: {VISUALS_DIR}")


if __name__ == "__main__":
    run()

