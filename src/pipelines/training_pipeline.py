import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier

from sklearn.metrics import f1_score

from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE

from src.data.load_data import load_data
from src.data.preprocess import basic_cleaning


def run_training_pipeline(data_path: str):

    df = load_data(data_path)
    df = basic_cleaning(df)

    X = df.drop("loan_status", axis=1)
    y = df["loan_status"]

    categorical_cols = ["education", "self_employed"]
    numerical_cols = [col for col in X.columns if col not in categorical_cols]

    preprocessor = ColumnTransformer([
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    models = {
        "logistic": LogisticRegression(max_iter=1000),
        "tree": DecisionTreeClassifier(),
        "forest": RandomForestClassifier(n_estimators=300),
        "xgb": XGBClassifier(eval_metric="logloss")
    }

    best_model = None
    best_score = 0

    for name, model in models.items():

        pipeline = ImbPipeline([
            ("preprocessor", preprocessor),
            ("smote", SMOTE()),
            ("model", model)
        ])

        pipeline.fit(X_train, y_train)
        preds = pipeline.predict(X_test)

        score = f1_score(y_test, preds)

        print(f"{name} F1 Score: {score:.4f}")

        if score > best_score:
            best_score = score
            best_model = pipeline

    joblib.dump(best_model, "models/best_model.pkl")

    print(f"\n✅ Best Model Saved with F1 Score: {best_score:.4f}")

    return best_model