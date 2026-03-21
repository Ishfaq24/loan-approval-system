import axios from "axios";

const API_URL = "http://127.0.0.1:8000/predict";

export const predictLoan = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data.prediction;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};