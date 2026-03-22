import axios from "axios";

const API_URL = "https://loan-approval-system-5diw.onrender.com/predict";

export const predictLoan = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data.prediction;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};