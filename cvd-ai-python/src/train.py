from __future__ import annotations

from pathlib import Path
import pickle

import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier


PROJECT_ROOT = Path(__file__).resolve().parents[2]
ML_ROOT = PROJECT_ROOT / "cvd-ai-python"
X_DATASET_PATH = ML_ROOT / "data" / "processed" / "X_dataset.csv"
Y_DATASET_PATH = ML_ROOT / "data" / "processed" / "Y_dataset.csv"
MODEL_DIR = ML_ROOT / "Trained_Models"

MODEL_BUILDERS = {
    "decisionTreeModel.pkl": lambda: DecisionTreeClassifier(max_depth=8, random_state=4),
    "randomForestModel.pkl": lambda: RandomForestClassifier(
        n_estimators=300,
        min_samples_split=8,
        min_samples_leaf=2,
        random_state=4,
        n_jobs=-1,
    ),
    "logisticRegressionModel.pkl": lambda: LogisticRegression(
        solver="liblinear",
        max_iter=1000,
        random_state=4,
    ),
    "svmModel.pkl": lambda: SVC(
        C=1.0,
        gamma="scale",
        kernel="rbf",
        probability=True,
        random_state=4,
    ),
    "knnModel_Tuned.pkl": lambda: KNeighborsClassifier(n_neighbors=11, weights="distance"),
}


def run() -> None:
    if not X_DATASET_PATH.exists() or not Y_DATASET_PATH.exists():
        raise FileNotFoundError(
            "Processed datasets are missing. Run src/data_preprocess.py before training."
        )

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    x_df = pd.read_csv(X_DATASET_PATH)
    y_df = pd.read_csv(Y_DATASET_PATH).iloc[:, 0].astype(int)

    x_train, _x_test, y_train, _y_test = train_test_split(
        x_df, y_df, test_size=0.2, random_state=4
    )

    smote = SMOTE(random_state=4)
    x_train_balanced, y_train_balanced = smote.fit_resample(x_train, y_train)

    for model_filename, build_model in MODEL_BUILDERS.items():
        model = build_model()
        model.fit(x_train_balanced, y_train_balanced)
        model_path = MODEL_DIR / model_filename
        with model_path.open("wb") as model_file:
            pickle.dump(model, model_file)
        print(f"Saved {model_filename}")


if __name__ == "__main__":
    run()

