from fastapi import APIRouter
from server.schemas.model_input import ModelInput, ModelOutput
from server.controllers.decisionTreeController import predict_decision_tree
from server.controllers.svmController import predict_svm
from server.controllers.logisticRegressionController import predict_logistic_regression
from server.controllers.randomForestController import predict_random_forest
from server.controllers.knnController import predict_knn

router = APIRouter(prefix="/predict", tags=["Prediction Models"])

@router.post("/decision-tree", response_model=ModelOutput)
def decision_tree_predict(input_data: ModelInput):
    return predict_decision_tree(input_data)

@router.post("/svm", response_model=ModelOutput)
def svm_predict(input_data: ModelInput):
    return predict_svm(input_data)

@router.post("/logistic-regression", response_model=ModelOutput)
def logistic_regression_predict(input_data: ModelInput):
    return predict_logistic_regression(input_data)

@router.post("/random-forest", response_model=ModelOutput)
def random_forest_predict(input_data: ModelInput):
    return predict_random_forest(input_data)


@router.post("/knn", response_model=ModelOutput)
def knn_predict(input_data: ModelInput):
    return predict_knn(input_data)
