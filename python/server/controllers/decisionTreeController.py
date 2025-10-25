import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from server.schemas.model_input import ModelInput, ModelOutput
from server.core.config import MODEL_PATHS
import os

# Load model once at startup
with open(MODEL_PATHS["decision_tree"], "rb") as f:
    decision_tree_model = pickle.load(f)

# Calculate accuracy once at startup


def calculate_decision_tree_accuracy():
    try:
        # Load test data (same split as training)
        base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        X_path = os.path.join(base_path, "data", "processed", "X_dataset.csv")
        Y_path = os.path.join(base_path, "data", "processed", "Y_dataset.csv")

        X_dataFrame = pd.read_csv(X_path)
        Y_dataFrame = pd.read_csv(Y_path)

        # Use same split as training (random_state=4, test_size=0.2)
        X_train, X_test, y_train, y_test = train_test_split(
            X_dataFrame, Y_dataFrame, test_size=0.2, random_state=4
        )

        # Calculate accuracy
        y_pred = decision_tree_model.predict(X_test)
        return accuracy_score(y_test, y_pred)
    except Exception as e:
        raise RuntimeError(
            f"Failed to calculate Decision Tree accuracy: {str(e)}")


# Calculate accuracy at startup
DT_ACCURACY = calculate_decision_tree_accuracy()


# Load model once at startup
with open(MODEL_PATHS["decision_tree"], "rb") as f:
    decision_tree_model = pickle.load(f)

# Load test data for accuracy calculation (cached)
_test_data_cache = None


def get_test_data():
    global _test_data_cache
    if _test_data_cache is None:
        try:
            # Load the same dataset used for training
            import os
            base_path = os.path.dirname(
                os.path.dirname(os.path.dirname(__file__)))
            X_dataset_path = os.path.join(
                base_path, "data", "processed", "X_dataset.csv")
            Y_dataset_path = os.path.join(
                base_path, "data", "processed", "Y_dataset.csv")

            X_dataFrame = pd.read_csv(X_dataset_path)
            Y_dataFrame = pd.read_csv(Y_dataset_path)

            # Use same split as training (test_size=0.2, random_state=4)
            _, X_test, _, y_test = train_test_split(
                X_dataFrame, Y_dataFrame, test_size=0.2, random_state=4)
            _test_data_cache = (X_test, y_test)
        except Exception:
            _test_data_cache = (None, None)

    return _test_data_cache


def predict_decision_tree(input_data: ModelInput) -> ModelOutput:
    features = np.array([[
        input_data.male,
        input_data.age,
        input_data.education,
        input_data.currentSmoker,
        input_data.cigsPerDay,
        input_data.BPMeds,
        input_data.prevalentStroke,
        input_data.prevalentHyp,
        input_data.diabetes,
        input_data.totChol,
        input_data.sysBP,
        input_data.diaBP,
        input_data.BMI,
        input_data.heartRate,
        input_data.glucose
    ]])

    prediction = decision_tree_model.predict(features)[0]
    probabilities = decision_tree_model.predict_proba(features)[0].tolist()

    return ModelOutput(prediction=int(prediction), probabilities=probabilities)
