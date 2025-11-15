import pandas as pd
import numpy as np

# ============================================================
# 📂 WEEK 1: DATA EXPLORATION
# ============================================================

print("~"*70)
print("📘 WEEK 1: Data Exploration")
print("="*70)

# Read Data - نقرأ الملف مرة واحدة فقط
print("\n📥 Reading Dataset...\n")
# تأكد من أن اسم الملف صحيح
health_df = pd.read_csv("Enhanced_Vitamin_D_Deficiency_Prediction.csv") 
copy_df = health_df.copy()

# Show random sample
print("\n🎲 Random Sample from the Dataset:\n")
print(copy_df.sample(5))

# Size Of Data
print("\n📏 Size of the Dataset:\n")
print(f"Shape: {copy_df.shape}")

# Info About Data
print("\nℹ️ Information about the Dataset:\n")
copy_df.info()

#Head of colعmns
print("\n1️⃣ Columns name:\n")
print(copy_df.columns)


# Describe Data
print("\n📊 Descriptive Statistics:\n")
print(copy_df.describe())

# Unique Values
print("\n🔢 Number of Unique Values in the Dataset:\n")
print(copy_df.nunique())


target_col = 'Deficiency_Status'

print(f"\n⚖️ Balance of Target Column ({target_col}):\n")
print(copy_df[target_col].value_counts())

print(f"\n⚖️💯 Balance of Target Column ({target_col}) (%%):\n")
print(copy_df[target_col].value_counts(normalize=True) * 100)


# ============================================================
# 🧹 WEEK 2: DATA CLEANING & HANDLING
# ============================================================

print("\n" + "="*70)
print("🧹 WEEK 2: Data Cleaning & Handling")
print("="*70)

# --- 1️⃣ Check Missing Values ---
print("\n--- 1️⃣ Checking for Missing Values ---\n")
print(copy_df.isnull().sum())

# Optionally fill missing values
copy_df.fillna(copy_df.median(numeric_only=True), inplace=True)
print("\n✅ Missing values imputed with median (numeric columns only).\n")

# --- 2️⃣ Drop Duplicate Rows ---
print("\n--- 2️⃣ Checking and Removing Duplicate Rows ---\n")
print("Duplicates before removal:", copy_df.duplicated().sum())
copy_df.drop_duplicates(inplace=True)
print("✅ Duplicate rows removed.\n")

# --- 3️⃣ Outlier Detection ---
print("\n--- 3️⃣ Detecting Outliers using IQR Method ---\n")

# Select only numeric columns for outlier detection
numeric_cols_df = copy_df.select_dtypes(include=[np.number])
Q1_detect = numeric_cols_df.quantile(0.25)
Q3_detect = numeric_cols_df.quantile(0.75)
IQR_detect = Q3_detect - Q1_detect
outliers = ((numeric_cols_df < (Q1_detect - 1.5 * IQR_detect)) | (numeric_cols_df > (Q3_detect + 1.5 * IQR_detect))).sum()
print("Outliers per column (before handling):\n", outliers)


# --- 4️⃣ Outlier Handling (Sequential Dropping like the image) ---
print("\n--- 4️⃣ Outlier Handling (Sequential Dropping) ---\n")


numeric_cols_list = copy_df.select_dtypes(include=[np.number]).columns

shape_before_drop = copy_df.shape
print(f"Shape before dropping outliers: {shape_before_drop}")


for col in numeric_cols_list:
   
    Q1 = copy_df[col].quantile(0.25)
    Q3 = copy_df[col].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
  
    rows_before = copy_df.shape[0]
    
    
    copy_df = copy_df[(copy_df[col] >= lower_bound) & (copy_df[col] <= upper_bound)]
    
    
    rows_after = copy_df.shape[0]
    print(f"  - Processed '{col}': Removed {rows_before - rows_after} rows.")

shape_after_drop = copy_df.shape
print("\n✅ Sequential outlier dropping completed.")
print(f"Final shape after dropping outliers: {shape_after_drop}")
print(f"Total rows removed: {shape_before_drop[0] - shape_after_drop[0]}\n")


print("\n✅ Week 2 Data Cleaning & Handling Completed Successfully!\n")

# ============================================================
# 🚀 END OF WEEK 2
# ============================================================

print("="*70)
print("🎉 Data Exploration & Cleaning Done! Ready for Week 3 🚀")
print("="*70)