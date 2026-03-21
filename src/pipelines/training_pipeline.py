import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier


def run_training_pipeline(data_path):

    # =========================
    # 1. LOAD DATA
    # =========================
    df = pd.read_csv(data_path)

    # Clean column names
    df.columns = df.columns.str.strip()

    print("✅ Columns:", df.columns)

    # =========================
    # 2. TARGET
    # =========================
    # Clean values first
    df["loan_status"] = df["loan_status"].str.strip().str.lower()

    # Map properly
    df["loan_status"] = df["loan_status"].map({
        "approved": 1,
        "rejected": 0
    })
    # Drop missing target
    df = df.dropna(subset=["loan_status"])

    print("\nRaw loan_status values:")
    print(df["loan_status"].unique())
    # =========================
    # 3. FEATURES
    # =========================
    X = df.drop(["loan_id", "loan_status"], axis=1)
    y = df["loan_status"]

    # =========================
    # 4. DATA INFO
    # =========================
    print("\n📊 Class Distribution:")
    print(y.value_counts())

    # =========================
    # 5. FEATURE TYPES
    # =========================
    categorical_cols = ["education", "self_employed"]
    numerical_cols = [col for col in X.columns if col not in categorical_cols]

    # =========================
    # 6. PREPROCESSOR
    # =========================
    preprocessor = ColumnTransformer([
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ])

    # =========================
    # 7. TRAIN-TEST SPLIT
    # =========================
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y   # 🔥 important
    )

    # =========================
    # 8. MODELS
    # =========================
    models = {
        "logistic": LogisticRegression(max_iter=1000),
        "tree": DecisionTreeClassifier(max_depth=5),
        "forest": RandomForestClassifier(
            n_estimators=150,
            max_depth=6,
            random_state=42
        ),
        "xgb": XGBClassifier(
            n_estimators=300,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=1,      # L1 regularization
            reg_lambda=1,     # L2 regularization
            random_state=42,
            use_label_encoder=False,
            eval_metric="logloss"
        )
    }

    # =========================
    # 9. TRAIN + EVALUATE
    # =========================
    best_score = 0
    best_model = None

    for name, model in models.items():

        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("model", model)
        ])

        pipeline.fit(X_train, y_train)

        preds = pipeline.predict(X_test)

        score = f1_score(y_test, preds)

        print(f"{name} F1 Score: {score:.4f}")

        if score > best_score:
            best_score = score
            best_model = pipeline

    # =========================
    # 10. SAVE MODEL
    # =========================
    os.makedirs("models", exist_ok=True)

    model_path = os.path.join("models", "best_model.pkl")

    joblib.dump(best_model, model_path)

    print(f"\n✅ Best Model Saved (F1: {best_score:.4f})")

    # =========================
    # 11. FEATURE IMPORTANCE
    # =========================
    try:
        model_step = best_model.named_steps["model"]

        if hasattr(model_step, "feature_importances_"):
            print("\n📊 Feature Importances:")
            print(model_step.feature_importances_)

    except Exception as e:
        print("Feature importance not available:", e)