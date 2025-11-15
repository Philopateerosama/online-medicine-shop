import pandas as pd
import numpy as np

# ============================================================
# 🧠 MACHINE LEARNING PROJECT
# WEEK 1 → Data Exploration
# WEEK 2 → Data Cleaning
# ============================================================

# ============================================================
# 📂 WEEK 1: DATA EXPLORATION
# ============================================================

print("="*70)
print(" WEEK 1: Data Exploration")
print("="*70)

# Read Data
print("\n Reading Datasets...\n")
df = pd.read_csv("synthetic_health_dataset.csv")

# Show random samples
print("\n Random Samples from Dataset:\n")
print("Sample (5 rows):\n", df.sample(5))
print("\nSample (10%):\n", df.sample(frac=0.1))

# Size Of Data
print("\n📏 Size of Dataset:\n")
print(f"Shape: {df.shape}")

# Info About Data
print("\nℹ Information about Dataset:\n")
df.info()

# Describe Data
print("\n📊 Descriptive Statistics:\n")
print(df.describe())

# Unique Values
print("\n🔢 Number of Unique Values in Dataset:\n")
print(df.nunique())

# ============================================================
# 🧹 WEEK 2: DATA CLEANING
# ============================================================

print("\n" + "="*70)
print("🧹 WEEK 2: Data Cleaning")
print("="*70)

# --- ⿡ Check Missing Values ---
print("\n🔍 Checking for Missing Values:\n")
print(df.isnull().sum())

# Optionally fill missing values
df.fillna(df.mean(numeric_only=True), inplace=True)
print("\n✅ Missing values imputed with mean (numeric columns only).\n")

# --- ⿢ Drop Duplicate Rows ---
print("🧾 Checking and Removing Duplicate Rows:\n")
print("Duplicates:", df.duplicated().sum())
df.drop_duplicates(inplace=True)

print("✅ Duplicate rows removed.\n")

# --- ⿣ Outlier Detection ---
print("🚨 Detecting Outliers using IQR Method (Heart Attack Example):\n")

# Select only numeric columns for outlier detection
numeric_cols = df.select_dtypes(include=[np.number])

Q1 = numeric_cols.quantile(0.25)
Q3 = numeric_cols.quantile(0.75)
IQR = Q3 - Q1
outliers = ((numeric_cols < (Q1 - 1.5 * IQR)) | (numeric_cols > (Q3 + 1.5 * IQR))).sum()
print("Outliers per column:\n", outliers)

print("\n✅ Week 2 Data Cleaning Completed Successfully!\n")

# ============================================================
# 🚀 END OF WEEK 2
# ============================================================

print("="*70)
print("🎉 Data Exploration & Cleaning Done! Ready for Week 3 🚀")
print("="*70)
