import joblib
import pandas as pd

# Load trained model ONCE
model = joblib.load("models/best_model.pkl")

def predict(data: dict):
    
    df = pd.DataFrame([data])

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    return {
        "approval": "Approved" if prediction == 1 else "Rejected",
        "probability": float(probability),
        "risk_level": get_risk(probability)
    }

def get_risk(prob):
    if prob > 0.7:
        return "Low Risk"
    elif prob > 0.4:
        return "Medium Risk"
    else:
        return "High Risk"