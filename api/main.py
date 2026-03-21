from fastapi import FastAPI
from api.routes import router

app = FastAPI(title="Loan Approval System")

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Loan Approval API Running 🚀"}