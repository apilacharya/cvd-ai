import pickle
from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


def load_model_accuracies():
    """Load all models and calculate their actual accuracy scores"""
    project_root = Path(__file__).resolve().parents[2]
    x_dataset_path = project_root / "data" / "processed" / "X_dataset.csv"
    y_dataset_path = project_root / "data" / "processed" / "Y_dataset.csv"
    model_dir = project_root / "Trained_Models"

    if not x_dataset_path.exists() or not y_dataset_path.exists():
        raise FileNotFoundError(
            f"Processed datasets not found at {x_dataset_path} and {y_dataset_path}."
        )

    x_dataframe = pd.read_csv(x_dataset_path)
    y_dataframe = pd.read_csv(y_dataset_path).iloc[:, 0]

    _, x_test, _, y_test = train_test_split(
        x_dataframe, y_dataframe, test_size=0.2, random_state=4
    )

    models = {
        "decision_tree": "decisionTreeModel.pkl",
        "random_forest": "randomForestModel.pkl",
        "logistic_regression": "logisticRegressionModel.pkl",
        "svm": "svmModel.pkl",
        "knn": "knnModel_Tuned.pkl",
    }

    accuracies = {}
    for model_name, model_file in models.items():
        model_path = model_dir / model_file
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")

        with model_path.open("rb") as model_handle:
            model = pickle.load(model_handle)

        y_pred = model.predict(x_test)
        accuracy = accuracy_score(y_test, y_pred)
        accuracies[model_name] = round(accuracy, 4)
        print(f"{model_name}: {accuracy:.4f}")

    return accuracies


if __name__ == "__main__":
    print("Calculating actual model accuracies...")
    accuracies = load_model_accuracies()
    print("\nFinal accuracies:")
    for model, acc in accuracies.items():
        print(f"{model}: {acc}")
