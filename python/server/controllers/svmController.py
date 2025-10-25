import pickle
import numpy as np
from server.schemas.model_input import ModelInput, ModelOutput
from server.core.config import MODEL_PATHS

# Load model once at startup
with open(MODEL_PATHS["svm"], "rb") as f:
    svm_model = pickle.load(f)


def predict_svm(input_data: ModelInput) -> ModelOutput:
    features = np.array([[v for v in input_data.model_dump().values()]])
    prediction = svm_model.predict(features)[0]
    probabilities = svm_model.predict_proba(features)[0].tolist()
    return ModelOutput(
        prediction=int(prediction),
        probabilities=probabilities
    )
