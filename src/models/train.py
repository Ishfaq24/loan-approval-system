import os
from src.pipelines.training_pipeline import run_training_pipeline

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    data_path = os.path.join(base_dir, "data", "raw", "loan_data.csv")

    print("Using dataset at:", data_path)

    run_training_pipeline(data_path)