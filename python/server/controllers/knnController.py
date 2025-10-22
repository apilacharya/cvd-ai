import pickle
import numpy as np
from server.schemas.model_input import ModelInput, ModelOutput
from server.core.config import MODEL_PATHS

with open(MODEL_PATHS["knn"], "rb") as f:
    knn_model = pickle.load(f)

def predict_knn(input_data: ModelInput) -> ModelOutput:
    features = np.array([[v for v in input_data.model_dump().values()]])
    prediction = knn_model.predict(features)[0]
    probabilities = knn_model.predict_proba(features)[0].tolist()
    return ModelOutput(prediction=int(prediction), probabilities=probabilities)
