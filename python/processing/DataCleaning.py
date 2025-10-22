import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")

# raw data path 
raw_data_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/raw/framingham.csv"
cleaned_data_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/cleaned/cleanedFraminghamDataSet.csv"

# Reading the data
df = pd.read_csv(raw_data_path)

# To display first 5 rows in the dataframe 
# print(df.head())

# To display last 5 rows in the dataframe 
# print(df.tail())

# To know the data type and null values if any
# print(df.info())


# number of null values
# print(df.isnull().sum())

# missing value for the column education may not related, so filling it with 0
df.education.fillna(0,inplace=True)

# Missing values in column cigsPerDay may be from smokers, hence imputing it with median of current smoker:
df.cigsPerDay.fillna(df.cigsPerDay.where(df.currentSmoker==1).median(),inplace=True)

# Missing values in column BPMeds may be because they aren't on any kind of medications. so filling missing values with '0'
df.BPMeds.fillna(0,inplace=True)

# imputing the missing values in the totChol (total cholestrol) column with the median
df['totChol'].fillna(df.totChol.median(),inplace=True)

# imputing the missing values in the BMI column with the median
df['BMI'].fillna(df.BMI.median(),inplace=True)

# since there is only one missing value in the heartRate column and it is from a smoker so imputing missing value with the median of heartRate of those who are smoker
df['heartRate'].fillna(df['heartRate'].where(df['currentSmoker']==1).median(),inplace=True)

# most of the missing value in the glucose column are from non diabetics so imputing the missing values with the median of non diabetic
df['glucose'].fillna(df['glucose'].where(df['diabetes']==0).median(),inplace=True)


# checking if there still exists any null values
print(df.isnull().sum())

# no null values are present in the dataset now, so exporting the processed data
df.to_csv("cleanedFraminghamDataSet.csv", index = False)

df.to_csv(cleaned_data_path, index=False)

