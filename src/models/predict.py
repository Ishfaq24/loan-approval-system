import os
import joblib
import pandas as pd
import shap

# Load model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")

model = joblib.load(MODEL_PATH)

# TreeExplainer for tree models
explainer = shap.TreeExplainer(model.named_steps["model"])


def predict(data: dict):

    df = pd.DataFrame([data])

    # Prediction
    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    # Preprocess input
    processed = model.named_steps["preprocessor"].transform(df)

    # SHAP values
    shap_values = explainer(processed)
    shap_array = shap_values.values

    # Handle shape issues
    if len(shap_array.shape) > 2:
        shap_array = shap_array[0]

    shap_array = shap_array[0]
    shap_list = shap_array.tolist()

    # Feature names
    feature_names = model.named_steps["preprocessor"].get_feature_names_out()

    # Clean feature names
    clean_names = [name.split("__")[-1] for name in feature_names]

    # Pair features with SHAP values
    pairs = list(zip(clean_names, shap_list))

    # Aggregate encoded features
    feature_importance = {}
    for name, value in pairs:
        feature_importance[name] = feature_importance.get(name, 0) + value

    # ✅ Normalize safely (NO filtering)
    total = sum(abs(v) for v in feature_importance.values())

    if total != 0:
        feature_importance = {
            k: v / total for k, v in feature_importance.items()
        }

    # Sort features
    pairs_sorted = sorted(
        feature_importance.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    # Always take top features
    top_features = pairs_sorted[:8]

    # ✅ Fallback (important)
    if not top_features:
        top_features = pairs_sorted[:3]

    explanation = dict(top_features)

    # Generate insights
    insights = generate_insights(top_features)

    return {
        "approval": "Approved" if prediction == 1 else "Rejected",
        "probability": float(probability),
        "risk_level": get_risk(probability),
        "explanations": explanation,
        "insights": insights
    }


def generate_insights(features):
    messages = []

    for name, value in features:
        pretty_name = name.replace("_", " ")

        if value > 0:
            messages.append(f"{pretty_name} increased the chances of approval")
        else:
            messages.append(f"{pretty_name} reduced the chances of approval")

    return messages


def get_risk(prob):
    if prob > 0.7:
        return "Low Risk"
    elif prob > 0.4:
        return "Medium Risk"
    else:
        return "High Risk"