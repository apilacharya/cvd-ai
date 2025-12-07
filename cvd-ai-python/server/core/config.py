from pathlib import Path

# Get the base directory = project root (where Trained_Models exists)
BASE_DIR = Path(__file__).resolve().parents[1].parent

# Folder containing trained models
MODEL_DIR = BASE_DIR / "Trained_Models"

# You can define each model path here if you want:
MODEL_PATHS = {
    "decision_tree": MODEL_DIR / "decisionTreeModel.pkl",
    "random_forest": MODEL_DIR / "randomForestModel.pkl",
    "logistic_regression": MODEL_DIR / "logisticRegressionModel.pkl",
    "svm": MODEL_DIR / "svmModel.pkl",
    "knn": MODEL_DIR / "knnModel_Tuned.pkl",
}
