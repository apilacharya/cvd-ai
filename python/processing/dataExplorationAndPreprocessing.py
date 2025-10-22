import os
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

sns.set_theme(style="whitegrid")

cleaned_data_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/cleaned/cleanedFraminghamDataSet.csv"
x_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/X_dataset.csv.csv"
y_dataset_path = "E:/ASCOL/7th Semester/CVD-Final-Year/data/processed/Y_dataset.csv.csv"

# data frame
df = pd.read_csv(cleaned_data_path)

# Five Point Summary

print(df.describe().T)

# Data types of colums
print(df.info())

# columns of data frame
print(df.columns)

# continuous data in our data frame
col = ['age','totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']

# Searching for outliers in our data set
for i in col:
    sns.boxplot(df[i])
    plt.title(f"Boxplot of {i}")
    plt.xlabel(i)                
    plt.show()

# from the box plots, it was found out that "sysBP", "diaBP", "BMI", "heartRate", "glucose" columns consists of outliers

# visualizing the distribution of continuous data before removing outliers
for i in col:
    sns.displot(df[i], kde=True) 
    plt.title(f"Distribution of {i} before outliers removal")
    plt.xlabel(i)
    plt.ylabel("Count")
    plt.show()


# making a copy of the cleaned dataset before removing the outliers
dfCopy = df.copy()

#removing outliers
for i in col:
    q1 = dfCopy[i].quantile(q=0.25)
    q2 = dfCopy[i].quantile()
    q3 = dfCopy[i].quantile(q=0.75)
    iqr = q3-q1
    ul = q3+1.5*iqr
    ll = q1-1.5*iqr

    dfCopy = dfCopy[(dfCopy[i]<ul ) & (dfCopy[i]>ll)] 

# visualizing the distribution of continuous data after removal of outliers
for i in col:
    sns.displot(dfCopy[i], kde=True) 
    plt.title(f"Distribution of {i} after outliers removal")
    plt.xlabel(i)
    plt.ylabel("Count")
    plt.show()


# after the removal of outliers, the data seems to be following normal distribution

# Information about the dataset after outlier analysis
print('Number of data before outlier treatment: '.format(df.shape[0]))
print('Number of rows after outlier treatment: '.format(dfCopy.shape[0]))
print('Number of rows lost due to outlier treatment: '.format(df.shape[0] - dfCopy.shape[0]))


# Ratio of the presence of CHD (Congenital Heart Disease)
print(dfCopy['TenYearCHD'].value_counts(normalize=True))

# visualizing the ratio of CHD
sns.countplot(x='TenYearCHD', data=dfCopy) 
plt.title("Ratio of CHD in the Next Ten Years")
plt.xlabel("CHD (0 = No, 1 = Yes)")
plt.ylabel("Count")
plt.show()


# heat map for visualizing correlation between the columns 
cor = dfCopy.corr()
plt.figure(figsize=(15,9))
sns.heatmap(cor,annot=True)
plt.show()


# splitting the data into dependent data and independent data 

X = dfCopy.drop(['TenYearCHD'], axis=1)
Y = dfCopy['TenYearCHD']

# Standardizind data due to variation in scale 
scaler = StandardScaler() 
X_sig = scaler.fit_transform(X)

# converting the numpy array into pandas data frame
X_sig_df = pd.DataFrame(X_sig, columns=X.columns)

# saving X and Y dataset in a csv file for model training
X_sig_df.to_csv("X_dataset.csv", index = False)
X_sig_df.to_csv(x_dataset_path, index=False)

Y.to_csv("Y_dataset.csv", index = False)
Y.to_csv(y_dataset_path, index=False)
