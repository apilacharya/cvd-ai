
import os
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
from sklearn.neighbors import KNeighborsClassifier
from imblearn.over_sampling import SMOTE
from scipy.stats import randint as sp_randint

warnings.filterwarnings("ignore")

# ✅ Confusion Matrix Plot Function
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


# ✅ File Paths
X_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/X_dataset.csv"
Y_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/Y_dataset.csv"
Model_Saving_Path = "E:/ASCOL/7th Semester/CVD-Final-Year/Trained_Models"

# ✅ Load Datasets
X_dataFrame = pd.read_csv(X_dataset_path)
Y_dataFrame = pd.read_csv(Y_dataset_path)

# ✅ Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X_dataFrame, Y_dataFrame, test_size=0.2, random_state=4
)

# =====================================================
# 🧩 Step 1: Base KNN (Before SMOTE, Before Tuning)
# =====================================================
print("\n=== KNN (Before SMOTE, Before Tuning) ===")
knn = KNeighborsClassifier()
knn.fit(X_train, y_train)

# Predictions
y_pred_train = knn.predict(X_train)
y_pred_test = knn.predict(X_test)

# Evaluation
print("Train Accuracy:", accuracy_score(y_train, y_pred_train))
print("Test Accuracy:", accuracy_score(y_test, y_pred_test))
print("\nClassification Report (Test):\n", classification_report(y_test, y_pred_test))

plot_confusion_matrix(y_train, y_pred_train, title="Train Confusion Matrix (Before SMOTE)")
plot_confusion_matrix(y_test, y_pred_test, title="Test Confusion Matrix (Before SMOTE)")

# =====================================================
# 🧩 Step 2: Apply SMOTE to Balance Data
# =====================================================
print("\nApplying SMOTE...")
smote = SMOTE(random_state=1)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

# =====================================================
# 🧩 Step 3: Hyperparameter Tuning (After SMOTE)
# =====================================================
print("\nPerforming Hyperparameter Tuning...")

param_dist = {
    "n_neighbors": sp_randint(1, 25),
    "p": sp_randint(1, 5),
    "weights": ["uniform", "distance"]
}

knn = KNeighborsClassifier()

random_search = RandomizedSearchCV(
    estimator=knn,
    param_distributions=param_dist,
    n_iter=20,
    cv=3,
    random_state=42,
    n_jobs=-1
)

random_search.fit(X_train_sm, y_train_sm)

print("Best Parameters Found:", random_search.best_params_)

# =====================================================
# 🧩 Step 4: Train Final Model with Best Params
# =====================================================
best_knn = KNeighborsClassifier(**random_search.best_params_)
best_knn.fit(X_train_sm, y_train_sm)

# Predictions
y_pred_train_sm = best_knn.predict(X_train_sm)
y_pred_test_sm = best_knn.predict(X_test)

# Evaluation
print("\n=== KNN (After SMOTE + Tuning) ===")
print("Train Accuracy:", accuracy_score(y_train_sm, y_pred_train_sm))
print("Test Accuracy:", accuracy_score(y_test, y_pred_test_sm))
print("\nClassification Report (Test):\n", classification_report(y_test, y_pred_test_sm))

# Confusion Matrices
plot_confusion_matrix(y_train_sm, y_pred_train_sm, title="Train Confusion Matrix (After SMOTE + Tuning)")
plot_confusion_matrix(y_test, y_pred_test_sm, title="Test Confusion Matrix (After SMOTE + Tuning)")

# =====================================================
# 🧩 Step 5: Save Final Trained Model
# =====================================================
model_file = os.path.join(Model_Saving_Path, "knnModel_Tuned.pkl")
with open(model_file, "wb") as file:
    pickle.dump(best_knn, file)

print(f"\n✅ Trained and Tuned KNN model saved successfully at: {model_file}")


