import os
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

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

logreg = LogisticRegression(solver='liblinear', fit_intercept=True) 

logreg.fit(X_train, y_train)

y_prob_train = logreg.predict_proba(X_train)[:,1]
y_pred_train = logreg.predict (X_train)

print('\nOverall accuracy - Train: ', accuracy_score(y_train, y_pred_train))

y_prob = logreg.predict_proba(X_test)[:,1]
y_pred = logreg.predict (X_test)

plot_confusion_matrix(y_train, y_pred_train, title="Train Confusion Matrix (Before SMOTE)")

plot_confusion_matrix(y_test, y_pred, title="Test Confusion Matrix (Before SMOTE)")

print('\nOverall accuracy - Test: ','\n', accuracy_score(y_test, y_pred))
print('\nClassification report for test:\n',classification_report(y_test,y_pred))

smote = SMOTE(random_state=1)

X_train_sm, y_train_sm = smote.fit_resample(X_train,y_train)


logreg_sm = LogisticRegression(solver='liblinear', fit_intercept=True) 

logreg_sm.fit(X_train_sm, y_train_sm)

y_prob_train = logreg_sm.predict_proba(X_train_sm)[:,1]
y_pred_train = logreg_sm.predict (X_train_sm)

print('Confusion Matrix - Train: ', '\n', confusion_matrix(y_train_sm, y_pred_train))
print('\nOverall accuracy - Train: ', accuracy_score(y_train_sm, y_pred_train))

y_prob = logreg_sm.predict_proba(X_test)[:,1]
y_pred = logreg_sm.predict (X_test)

# Full path with file name
model_file = os.path.join(Model_Saving_Path, "logisticRegressionModel.pkl")

# Save the model
with open(model_file, "wb") as file:
    pickle.dump(logreg_sm, file)

plot_confusion_matrix(y_train_sm, y_pred_train, title="Train Confusion Matrix (After SMOTE)")

plot_confusion_matrix(y_test, y_pred, title="Test Confusion Matrix (After SMOTE)")

print('\nOverall accuracy - Test: ', accuracy_score(y_test, y_pred))
print('\nClassification report for test:\n',classification_report(y_test,y_pred))