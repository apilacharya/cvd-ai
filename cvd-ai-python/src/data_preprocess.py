from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.preprocessing import StandardScaler


PROJECT_ROOT = Path(__file__).resolve().parents[2]
ML_ROOT = PROJECT_ROOT / "cvd-ai-python"
RAW_DATA_PATH = ML_ROOT / "data" / "raw" / "framingham.csv"
CLEANED_DATA_PATH = ML_ROOT / "data" / "cleaned" / "cleanedFraminghamDataSet.csv"
X_DATASET_PATH = ML_ROOT / "data" / "processed" / "X_dataset.csv"
Y_DATASET_PATH = ML_ROOT / "data" / "processed" / "Y_dataset.csv"
TARGET_COLUMN = "TenYearCHD"


def _fill_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["education"] = df["education"].fillna(0)
    df["cigsPerDay"] = df["cigsPerDay"].fillna(df["cigsPerDay"].where(df["currentSmoker"] == 1).median())
    df["BPMeds"] = df["BPMeds"].fillna(0)
    df["totChol"] = df["totChol"].fillna(df["totChol"].median())
    df["BMI"] = df["BMI"].fillna(df["BMI"].median())
    df["heartRate"] = df["heartRate"].fillna(df["heartRate"].where(df["currentSmoker"] == 1).median())
    df["glucose"] = df["glucose"].fillna(df["glucose"].where(df["diabetes"] == 0).median())
    return df


def _remove_outliers_iqr(df: pd.DataFrame) -> pd.DataFrame:
    filtered = df.copy()
    columns = ["age", "totChol", "sysBP", "diaBP", "BMI", "heartRate", "glucose"]
    for column in columns:
        q1 = filtered[column].quantile(0.25)
        q3 = filtered[column].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)
        filtered = filtered[(filtered[column] > lower) & (filtered[column] < upper)]
    return filtered


def run() -> None:
    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(f"Raw dataset not found at {RAW_DATA_PATH}")

    CLEANED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    X_DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)

    raw_df = pd.read_csv(RAW_DATA_PATH)
    cleaned_df = _fill_missing_values(raw_df)
    processed_df = _remove_outliers_iqr(cleaned_df)

    x_df = processed_df.drop(columns=[TARGET_COLUMN])
    y_df = processed_df[TARGET_COLUMN].astype(int)

    scaler = StandardScaler()
    x_scaled = pd.DataFrame(scaler.fit_transform(x_df), columns=x_df.columns)

    processed_df.to_csv(CLEANED_DATA_PATH, index=False)
    x_scaled.to_csv(X_DATASET_PATH, index=False)
    y_df.to_csv(Y_DATASET_PATH, index=False)

    print(f"Saved cleaned dataset: {CLEANED_DATA_PATH}")
    print(f"Saved feature matrix: {X_DATASET_PATH}")
    print(f"Saved target vector: {Y_DATASET_PATH}")
    print(f"Rows after preprocessing: {len(processed_df)}")


if __name__ == "__main__":
    run()

