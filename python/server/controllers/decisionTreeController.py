import pickle
import numpy as np
from server.schemas.model_input import ModelInput, ModelOutput
from server.core.config import MODEL_PATHS

# Load model once at startup
with open(MODEL_PATHS["decision_tree"], "rb") as f:
    decision_tree_model = pickle.load(f)

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
