from fastapi import APIRouter
from api.schema import LoanRequest
from src.models.predict import predict

router = APIRouter()

@router.post("/predict")
def get_prediction(request: LoanRequest):
    
    result = predict(request.dict())

    return {
        "status": "success",
        "prediction": result
    }