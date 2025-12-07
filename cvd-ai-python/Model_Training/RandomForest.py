


import os
import pickle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from scipy.stats import randint as sp_randint

# ---------------------------
# Suppress Warnings
# ---------------------------
warnings.filterwarnings("ignore")

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
# Paths
# ---------------------------
X_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/X_dataset.csv"
Y_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/Y_dataset.csv"
Model_Saving_Path = "E:/ASCOL/7th Semester/CVD-Final-Year/Trained_Models"

# ---------------------------
# Load Data
# ---------------------------
X_dataFrame = pd.read_csv(X_dataset_path)
Y_dataFrame = pd.read_csv(Y_dataset_path)

# ---------------------------
# Train-Test Split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_dataFrame, Y_dataFrame, test_size=0.2, random_state=4
)

# ---------------------------
# Train Random Forest BEFORE SMOTE
# ---------------------------
rfc = RandomForestClassifier(n_estimators=10, random_state=1)
rfc.fit(X_train, y_train)

y_pred_train_before = rfc.predict(X_train)
y_pred_test_before = rfc.predict(X_test)

print("\n=== Before SMOTE ===")
print("Train Accuracy:", accuracy_score(y_train, y_pred_train_before))
print("Test Accuracy:", accuracy_score(y_test, y_pred_test_before))
print("\nClassification Report (Before SMOTE):\n", classification_report(y_test, y_pred_test_before))

plot_confusion_matrix(y_train, y_pred_train_before, title="Train Confusion Matrix (Before SMOTE)")
plot_confusion_matrix(y_test, y_pred_test_before, title="Test Confusion Matrix (Before SMOTE)")

# ---------------------------
# Apply SMOTE (Handle Imbalance)
# ---------------------------
smote = SMOTE(random_state=1)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

# ---------------------------
# Hyperparameter Tuning
# ---------------------------
params = {
    'n_estimators': sp_randint(5, 50),
    'criterion': ['gini', 'entropy'],
    'max_depth': sp_randint(2, 15),
    'min_samples_split': sp_randint(2, 20),
    'min_samples_leaf': sp_randint(1, 20),
    'max_features': sp_randint(2, min(15, X_dataFrame.shape[1]))
}

rand_search_rfc = RandomizedSearchCV(
    RandomForestClassifier(random_state=1),
    param_distributions=params,
    cv=3,
    n_iter=20,
    random_state=1,
    n_jobs=-1
)

rand_search_rfc.fit(X_train_sm, y_train_sm)
print("\nBest Hyperparameters Found:", rand_search_rfc.best_params_)

# ---------------------------
# Train Random Forest AFTER SMOTE (with best params)
# ---------------------------
rfc_sm = RandomForestClassifier(**rand_search_rfc.best_params_, random_state=1)
rfc_sm.fit(X_train_sm, y_train_sm)

y_pred_train_after = rfc_sm.predict(X_train_sm)
y_pred_test_after = rfc_sm.predict(X_test)

print("\n=== After SMOTE ===")
print("Train Accuracy:", accuracy_score(y_train_sm, y_pred_train_after))
print("Test Accuracy:", accuracy_score(y_test, y_pred_test_after))
print("\nClassification Report (After SMOTE):\n", classification_report(y_test, y_pred_test_after))

plot_confusion_matrix(y_train_sm, y_pred_train_after, title="Train Confusion Matrix (After SMOTE)")
plot_confusion_matrix(y_test, y_pred_test_after, title="Test Confusion Matrix (After SMOTE)")

# ---------------------------
# Save the Final Model
# ---------------------------
os.makedirs(Model_Saving_Path, exist_ok=True)
model_file = os.path.join(Model_Saving_Path, "randomForestModel.pkl")

with open(model_file, "wb") as file:
    pickle.dump(rfc_sm, file)

print("\n✅ Model saved successfully at:", model_file)
print("\n✅ Random Forest Model Training Complete!")

