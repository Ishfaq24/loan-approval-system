import pandas as pd

def basic_cleaning(df):

    # ✅ Fix column names
    df.columns = df.columns.str.strip().str.lower()

    print("✅ Cleaned Columns:", df.columns)

    # Drop ID
    df = df.drop(columns=["loan_id"], errors="ignore")

    # ✅ CLEAN TARGET COLUMN VALUES (CRITICAL)
    df["loan_status"] = df["loan_status"].astype(str).str.strip()

    # Map target
    df["loan_status"] = df["loan_status"].map({
        "Approved": 1,
        "Rejected": 0
    })

    # ✅ REMOVE ROWS WHERE TARGET IS STILL NaN
    df = df.dropna(subset=["loan_status"])

    # Fix negative values
    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns
    
    for col in numeric_cols:
        df[col] = df[col].apply(lambda x: max(x, 0))

    return df