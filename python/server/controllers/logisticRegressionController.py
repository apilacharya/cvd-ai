import pickle
import numpy as np
from server.schemas.model_input import ModelInput, ModelOutput
from server.core.config import MODEL_PATHS

with open(MODEL_PATHS["logistic_regression"], "rb") as f:
    logistic_regression_model = pickle.load(f)

def predict_logistic_regression(input_data: ModelInput) -> ModelOutput:
    features = np.array([[v for v in input_data.model_dump().values()]])
    prediction = logistic_regression_model.predict(features)[0]
    probabilities = logistic_regression_model.predict_proba(features)[0].tolist()
    return ModelOutput(prediction=int(prediction), probabilities=probabilities)