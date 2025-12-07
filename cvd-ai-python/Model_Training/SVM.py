
import os
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    classification_report,
    roc_curve,
    auc
)
from imblearn.over_sampling import SMOTE
from scipy.stats import uniform

warnings.filterwarnings("ignore")

# ---------------------------
# Paths
# ---------------------------
X_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/X_dataset.csv"
Y_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/Y_dataset.csv"
Model_Saving_Path = "E:/ASCOL/7th Semester/CVD-Final-Year/Trained_Models"

# ---------------------------
# Load Dataset
# ---------------------------
X = pd.read_csv(X_dataset_path)
y = pd.read_csv(Y_dataset_path)

# ---------------------------
# Train-Test Split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------
# Handle Class Imbalance with SMOTE
# ---------------------------
smote = SMOTE(random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

print("Class distribution before SMOTE:", y_train.value_counts().to_dict())
print("Class distribution after SMOTE:", y_train_sm.value_counts().to_dict())

# ---------------------------
# Scaling Features
# ---------------------------
scaler = StandardScaler()
X_train_sm_scaled = scaler.fit_transform(X_train_sm)
X_test_scaled = scaler.transform(X_test)

# ---------------------------
# Function to Plot Confusion Matrix
# ---------------------------
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

# ---------------------------
# 1️⃣ Train SVM BEFORE TUNING
# ---------------------------
svm_basic = SVC(probability=True, random_state=42)
svm_basic.fit(X_train_sm_scaled, y_train_sm)

y_pred_test_basic = svm_basic.predict(X_test_scaled)
y_pred_train_basic = svm_basic.predict(X_train_sm_scaled)

print("\n===== SVM Classification Report BEFORE Tuning =====")
print("Train Accuracy:", accuracy_score(y_train_sm, y_pred_train_basic))
print("Test Accuracy:", accuracy_score(y_test, y_pred_test_basic))
print("\nTest Classification Report:\n", classification_report(y_test, y_pred_test_basic))

plot_confusion_matrix(y_train_sm, y_pred_train_basic, title="Train Confusion Matrix (Before Tuning)")
plot_confusion_matrix(y_test, y_pred_test_basic, title="Test Confusion Matrix (Before Tuning)")

# ---------------------------
# 2️⃣ Hyperparameter Tuning
# ---------------------------
param_dist = {
    'C': uniform(0.1, 10),  # continuous between 0.1 and 10
    'kernel': ['linear', 'rbf', 'poly', 'sigmoid'],
    'gamma': ['scale', 'auto']
}

rand_search_svm = RandomizedSearchCV(
    estimator=SVC(probability=True, random_state=42),
    param_distributions=param_dist,
    n_iter=20,
    cv=3,
    random_state=42,
    n_jobs=-1
)
rand_search_svm.fit(X_train_sm_scaled, y_train_sm)
print("\nBest Parameters from RandomizedSearchCV:", rand_search_svm.best_params_)

# ---------------------------
# 3️⃣ Train SVM AFTER TUNING
# ---------------------------
svm_best = SVC(**rand_search_svm.best_params_, probability=True, random_state=42)
svm_best.fit(X_train_sm_scaled, y_train_sm)

y_pred_train_tuned = svm_best.predict(X_train_sm_scaled)
y_pred_test_tuned = svm_best.predict(X_test_scaled)

print("\n===== SVM Classification Report AFTER Tuning =====")
print("Train Accuracy:", accuracy_score(y_train_sm, y_pred_train_tuned))
print("Test Accuracy:", accuracy_score(y_test, y_pred_test_tuned))
print("\nTest Classification Report:\n", classification_report(y_test, y_pred_test_tuned))

plot_confusion_matrix(y_train_sm, y_pred_train_tuned, title="Train Confusion Matrix (After Tuning)")
plot_confusion_matrix(y_test, y_pred_test_tuned, title="Test Confusion Matrix (After Tuning)")

# ---------------------------
# 4️⃣ ROC Curve and AUC
# ---------------------------
y_prob_test = svm_best.predict_proba(X_test_scaled)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, y_prob_test)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(6, 4))
plt.plot(fpr, tpr, color='blue', lw=2, label='ROC curve (AUC = %0.3f)' % roc_auc)
plt.plot([0, 1], [0, 1], color='gray', lw=1, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('SVM ROC Curve (After Tuning)')
plt.legend(loc="lower right")
plt.show()

print("AUC Score (After Tuning):", roc_auc)

# ---------------------------
# 5️⃣ Save the Trained Model
# ---------------------------
os.makedirs(Model_Saving_Path, exist_ok=True)
model_file = os.path.join(Model_Saving_Path, "svmModel.pkl")

with open(model_file, "wb") as file:
    pickle.dump(svm_best, file)

print("\n✅ SVM model saved successfully at:", model_file)
