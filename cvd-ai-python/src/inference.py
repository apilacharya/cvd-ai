from __future__ import annotations

from pathlib import Path
import argparse
import json
import pickle

import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[2]
ML_ROOT = PROJECT_ROOT / "cvd-ai-python"
MODEL_DIR = ML_ROOT / "Trained_Models"

FEATURE_ORDER = [
    "male",
    "age",
    "education",
    "currentSmoker",
    "cigsPerDay",
    "BPMeds",
    "prevalentStroke",
    "prevalentHyp",
    "diabetes",
    "totChol",
    "sysBP",
    "diaBP",
    "BMI",
    "heartRate",
    "glucose",
]

MODEL_ALIAS = {
    "decision_tree": "decisionTreeModel.pkl",
    "random_forest": "randomForestModel.pkl",
    "logistic_regression": "logisticRegressionModel.pkl",
    "svm": "svmModel.pkl",
    "knn": "knnModel_Tuned.pkl",
}


def predict(model_key: str, features: dict[str, float]) -> dict[str, object]:
    model_path = MODEL_DIR / MODEL_ALIAS[model_key]
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    with model_path.open("rb") as model_file:
        model = pickle.load(model_file)

    vector = np.array([[float(features[column]) for column in FEATURE_ORDER]])
    prediction = int(model.predict(vector)[0])
    probabilities = model.predict_proba(vector)[0].tolist() if hasattr(model, "predict_proba") else []
    return {"prediction": prediction, "probabilities": probabilities}


def main() -> None:
    parser = argparse.ArgumentParser(description="Run local inference with saved CVD models.")
    parser.add_argument("--model", choices=MODEL_ALIAS.keys(), required=True)
    parser.add_argument(
        "--features",
        required=True,
        help="JSON object with all 15 model input fields.",
    )
    args = parser.parse_args()

    feature_payload = json.loads(args.features)
    missing = [column for column in FEATURE_ORDER if column not in feature_payload]
    if missing:
        raise ValueError(f"Missing required feature(s): {', '.join(missing)}")

    output = predict(args.model, feature_payload)
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()

