import pickle
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from sklearn.tree import DecisionTreeClassifier

warnings.filterwarnings("ignore")

def plot_confusion_matrix(y_true, y_pred, title="Confusion Matrix"):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(6, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap="Blues", cbar=False,
                xticklabels=["Predicted 0", "Predicted 1"],
                yticklabels=["Actual 0", "Actual 1"])
    plt.title(title)
    plt.ylabel("Actual")
    plt.xlabel("Predicted")
    plt.show()

X_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/X_dataset.csv"
Y_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/Y_dataset.csv"
Model_Saving_Path = "E:/ASCOL/7th Semester/CVD-Final-Year/Trained_Models"


X_dataFrame = pd.read_csv(X_dataset_path)
Y_dataFrame = pd.read_csv(Y_dataset_path)

X_train, X_test, y_train, y_test = train_test_split(X_dataFrame, Y_dataFrame, test_size=0.2, random_state=4)

dt = DecisionTreeClassifier()
dt.fit(X_train, y_train)

y_pred_train = dt.predict(X_train)
y_pred = dt.predict(X_test)
y_prob = dt.predict_proba(X_test)

print('Classification report for test:\n',classification_report(y_test,y_pred))


#hyper parameter tuning (grid search)

from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
dt = DecisionTreeClassifier()

params = {'max_depth' : [2,3,4,5,6,7,8],
        'min_samples_split': [2,3,4,5,6,7,8,9,10],
        'min_samples_leaf': [1,2,3,4,5,6,7,8,9,10]}

gsearch = GridSearchCV(dt, param_grid=params, cv=5)

gsearch.fit(X_train,y_train)

print("Best Hyperparameters:", gsearch.best_params_)
best_dt = gsearch.best_estimator_


dt = DecisionTreeClassifier(**gsearch.best_params_)

dt.fit(X_train, y_train)

y_pred_train = dt.predict(X_train)
y_prob_train = dt.predict_proba(X_train)[:,1]

y_pred = dt.predict(X_test)
y_prob = dt.predict_proba(X_test)[:,1]

print('\nClassification report for test:\n',classification_report(y_test,y_pred))


#hyper parameter tuning (random search)

from scipy.stats import randint as sp_randint

dt = DecisionTreeClassifier(random_state=1)

params = {'max_depth' : sp_randint(2,10),
        'min_samples_split': sp_randint(2,50),
        'min_samples_leaf': sp_randint(1,20),
         'criterion':['gini', 'entropy']}

rand_search = RandomizedSearchCV(dt, param_distributions=params, cv=3, 
                                 random_state=1)

rand_search.fit(X_train, y_train)
print(rand_search.best_params_)

dt = DecisionTreeClassifier(**rand_search.best_params_)

dt.fit(X_train, y_train)

model_file = os.path.join(Model_Saving_Path, "decisionTreeModel.pkl")


with open(model_file, "wb") as file:
    pickle.dump(dt, file)

y_pred_train = dt.predict(X_train)
y_prob_train = dt.predict_proba(X_train)[:,1]

y_pred = dt.predict(X_test)
y_prob = dt.predict_proba(X_test)[:,1]

print('Classification report for test:\n',classification_report(y_test,y_pred))