from pydantic import BaseModel
from typing import List


class ModelInput(BaseModel):
    male: float
    age: float
    education: float
    currentSmoker: float
    cigsPerDay: float
    BPMeds: float
    prevalentStroke: float
    prevalentHyp: float
    diabetes: float
    totChol: float
    sysBP: float
    diaBP: float
    BMI: float
    heartRate: float
    glucose: float


class ModelOutput(BaseModel):
    prediction: int
    probabilities: List[float]
