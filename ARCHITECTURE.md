# 🏗️ Loan Approval System — Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOAN APPROVAL SYSTEM                        │
├─────────────────┬───────────────────────┬───────────────────────────┤
│   Frontend      │     Backend API       │     ML Pipeline           │
│   (React/Vite)  │     (FastAPI)         │     (scikit-learn/XGB)    │
│                 │                       │                           │
│  loan-ui/       │  api/                 │  src/                     │
│  ├─ App.jsx     │  ├─ main.py           │  ├─ data/                 │
│  ├─ Predict.jsx │  ├─ routes.py         │  ├─ features/             │
│  └─ predict.js  │  └─ schema.py         │  ├─ models/               │
│                 │                       │  ├─ pipelines/             │
│  Port: 5173     │  Port: 8000           │  └─ utils/                │
└─────────────────┴───────────────────────┴───────────────────────────┘
```

---

## System Architecture Diagram

```
┌──────────────┐       HTTP POST /predict       ┌──────────────────┐
│              │  ──────────────────────────►    │                  │
│   React UI   │       JSON Request             │   FastAPI Server │
│  (Vite Dev)  │                                │   (Uvicorn)      │
│              │  ◄──────────────────────────    │                  │
└──────────────┘       JSON Response            └────────┬─────────┘
                       {approval, probability,           │
                        risk_level, explanations,        │
                        insights}                        │
                                                         │ calls
                                                         ▼
                                                ┌──────────────────┐
                                                │  Prediction      │
                                                │  Engine          │
                                                │                  │
                                                │  ┌────────────┐  │
                                                │  │ best_model  │  │
                                                │  │   .pkl      │  │
                                                │  └────────────┘  │
                                                │  ┌────────────┐  │
                                                │  │   SHAP      │  │
                                                │  │ Explainer   │  │
                                                │  └────────────┘  │
                                                └──────────────────┘
```

---

## Component Breakdown

### 1. Frontend — `loan-ui/`

| Item | Detail |
|------|--------|
| **Framework** | React 19 + Vite 8 |
| **UI Library** | Material UI (MUI) v7 |
| **HTTP Client** | Axios |
| **Theme** | Custom dark/gold "Premium Loan Analytics" theme |
| **Dev Server** | `http://localhost:5173` |

**File Structure:**

```
loan-ui/
├── src/
│   ├── App.jsx              # Main app — form inputs, result display, MUI theme
│   ├── components/
│   │   └── Predict.jsx      # Predict button with loading/error states
│   ├── api/
│   │   └── predict.js       # Axios POST to backend /predict endpoint
│   ├── main.jsx             # React entry point
│   ├── App.css
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── tailwind.config.js
```

**Data Flow:**
1. User fills in the loan application form (11 fields)
2. Clicks "Generate Analysis"
3. `predict.js` sends a POST request to `http://127.0.0.1:8000/predict`
4. Response is rendered: approval status, confidence, SHAP-based feature impacts, and insights

---

### 2. Backend API — `api/`

| Item | Detail |
|------|--------|
| **Framework** | FastAPI |
| **Server** | Uvicorn |
| **Middleware** | CORS (allow all origins for dev) |
| **Validation** | Pydantic `BaseModel` |

**File Structure:**

```
api/
├── main.py       # FastAPI app creation, CORS middleware, router include
├── routes.py     # POST /predict endpoint — calls prediction engine
└── schema.py     # LoanRequest Pydantic model (11 input fields)
```

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/`  | Health check — returns `{"message": "Loan Approval API running"}` |
| `POST` | `/predict` | Accepts `LoanRequest`, returns prediction result |

**Request Schema (`LoanRequest`):**

```python
{
    "no_of_dependents": int,
    "education": str,            # "Graduate" | "Not Graduate"
    "self_employed": str,        # "Yes" | "No"
    "income_annum": float,
    "loan_amount": float,
    "loan_term": float,
    "cibil_score": float,
    "residential_assets_value": float,
    "commercial_assets_value": float,
    "luxury_assets_value": float,
    "bank_asset_value": float
}
```

**Response Schema:**

```json
{
    "status": "success",
    "prediction": {
        "approval": "Approved | Rejected",
        "probability": 0.0 - 1.0,
        "risk_level": "Low Risk | Medium Risk | High Risk",
        "explanations": { "feature_name": shap_value, ... },
        "insights": ["feature X increased chances of approval", ...]
    }
}
```

---

### 3. ML Pipeline — `src/`

```
src/
├── data/
│   ├── load_data.py            # Loads CSV data via pandas
│   └── preprocess.py           # Cleans columns, maps target, fixes negatives
├── features/
│   └── feature_engineering.py  # (placeholder)
├── models/
│   ├── train.py                # Entry point — runs training pipeline
│   ├── predict.py              # Loads model, runs prediction + SHAP explanation
│   └── evaluate.py             # (placeholder)
├── pipelines/
│   └── training_pipeline.py    # Full training pipeline: load → preprocess → train → save
└── utils/
    └── helpers.py              # (placeholder)
```

#### Training Pipeline (`training_pipeline.py`)

```
Raw CSV Data
     │
     ▼
┌─────────────────┐
│  Load & Clean   │  Read CSV, strip columns, map target (Approved→1, Rejected→0)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Feature Split  │  X = all features (drop loan_id, loan_status)
│                 │  y = loan_status
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Preprocessor   │  ColumnTransformer:
│                 │    • Numerical → StandardScaler
│                 │    • Categorical (education, self_employed) → OneHotEncoder
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Train/Test     │  80/20 split, stratified by target
│  Split          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Model Training │  4 models trained in sklearn Pipeline:
│                 │    • Logistic Regression
│                 │    • Decision Tree (max_depth=5)
│                 │    • Random Forest (150 trees, max_depth=6)
│                 │    • XGBoost (300 trees, lr=0.05, regularized)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evaluation     │  F1 Score comparison → best model selected
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Save Model     │  joblib.dump → models/best_model.pkl
└─────────────────┘
```

#### Prediction Engine (`predict.py`)

```
Input Dict (11 features)
     │
     ▼
┌──────────────────┐
│  Load Model      │  joblib.load(best_model.pkl)
│  + SHAP Explainer│  shap.TreeExplainer on model step
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Predict         │  model.predict() → Approved/Rejected
│                  │  model.predict_proba() → confidence score
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  SHAP Explain    │  Compute SHAP values on preprocessed input
│                  │  Normalize → top 8 features by impact
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Risk Assessment │  probability > 0.7 → Low Risk
│  + Insights      │  probability > 0.4 → Medium Risk
│                  │  else             → High Risk
└──────────────────┘
```

---

### 4. Data — `data/`

```
data/
├── raw/
│   └── loan_data.csv         # Original dataset
└── processed/
    └── clean_data.csv        # Cleaned dataset (post-preprocessing)

loan_approval_dataset.csv     # Root-level copy of dataset
```

**Features (11 input columns):**

| Feature | Type | Description |
|---------|------|-------------|
| `no_of_dependents` | int | Number of dependents |
| `education` | categorical | Graduate / Not Graduate |
| `self_employed` | categorical | Yes / No |
| `income_annum` | float | Annual income |
| `loan_amount` | float | Requested loan amount |
| `loan_term` | float | Loan term in months |
| `cibil_score` | float | Credit score |
| `residential_assets_value` | float | Residential asset value |
| `commercial_assets_value` | float | Commercial asset value |
| `luxury_assets_value` | float | Luxury asset value |
| `bank_asset_value` | float | Bank/liquid asset value |

**Target:** `loan_status` → Approved (1) / Rejected (0)

---

### 5. Configuration — `config/`

```yaml
# config/config.yaml
model:
  test_size: 0.2
  random_state: 42

training:
  models:
    - logistic_regression
    - decision_tree
    - random_forest
    - xgboost
```

---

### 6. Saved Artifacts — `models/`

```
models/
├── best_model.pkl     # Serialized sklearn Pipeline (preprocessor + best model)
└── metrics.json       # (placeholder for evaluation metrics)
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, MUI 7, Axios |
| **Backend** | FastAPI, Uvicorn, Pydantic |
| **ML Models** | scikit-learn, XGBoost |
| **Explainability** | SHAP (TreeExplainer) |
| **Data Processing** | pandas, NumPy |
| **Serialization** | joblib |
| **Config** | YAML |
| **Notebooks** | Jupyter (EDA) |

---

## How to Run

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Train the model (if needed)
python -m src.models.train

# 3. Start the API server
uvicorn api.main:app --host 0.0.0.0 --port 8000

# 4. Start the frontend (in a separate terminal)
cd loan-ui
npm install
npm run dev
```

Or use the startup script for the API:

```bash
PORT=8000 bash start.sh
```

---

## Request/Response Flow

```
User fills form in React UI
        │
        ▼
POST http://127.0.0.1:8000/predict
  Body: { no_of_dependents, education, ... }
        │
        ▼
FastAPI validates request via Pydantic (LoanRequest)
        │
        ▼
routes.py → calls predict(request.dict())
        │
        ▼
predict.py:
  1. Converts dict → DataFrame
  2. model.predict() → approval decision
  3. model.predict_proba() → confidence
  4. Preprocessor transforms input
  5. SHAP TreeExplainer → feature importance
  6. Normalizes & ranks top 8 features
  7. Generates human-readable insights
  8. Computes risk level
        │
        ▼
JSON response returned to React UI
        │
        ▼
UI renders: Verdict, Confidence %, Feature Impact Bars, Strategic Insights
```

---

## Directory Tree

```
loan-approval-system/
├── api/                          # FastAPI backend
│   ├── main.py
│   ├── routes.py
│   └── schema.py
├── config/
│   └── config.yaml               # Model/training config
├── data/
│   ├── raw/
│   │   └── loan_data.csv
│   └── processed/
│       └── clean_data.csv
├── loan-ui/                       # React frontend
│   ├── src/
│   │   ├── api/predict.js
│   │   ├── components/Predict.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── models/
│   ├── best_model.pkl             # Trained model artifact
│   └── metrics.json
├── notebooks/
│   └── eda.ipynb                  # Exploratory Data Analysis
├── src/                           # ML source code
│   ├── data/
│   │   ├── load_data.py
│   │   └── preprocess.py
│   ├── features/
│   │   └── feature_engineering.py
│   ├── models/
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── evaluate.py
│   ├── pipelines/
│   │   └── training_pipeline.py
│   └── utils/
│       └── helpers.py
├── requirements.txt
├── start.sh
└── README.md
```
