import { useState } from "react";
import { predictLoan } from "../api/predict";
import { 
  Button, 
  CircularProgress, 
  Box, 
  Typography, 
  Fade,
  Tooltip 
} from "@mui/material";
import { 
  AutoGraph, 
  CheckCircleOutline, 
  ErrorOutline 
} from "@mui/icons-material";

export default function Predict({ formData, setResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate a small delay for "AI Processing" feel (optional)
      // await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await predictLoan(formData);
      setResult(result);
    } catch (err) {
      console.error(err);
      setError("Analysis Engine Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Tooltip title="Run AI-driven credit risk analysis" arrow>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handlePredict}
          disabled={loading}
          startIcon={!loading && <AutoGraph />}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            letterSpacing: "1.5px",
            borderRadius: "8px",
            // Golden Gradient Background
            background: "linear-gradient(45deg, #AF891B 30%, #D4AF37 90%)",
            color: "#000", // Dark text on gold looks premium
            boxShadow: "0 4px 20px rgba(212, 175, 55, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(45deg, #D4AF37 30%, #F9E498 90%)",
              boxShadow: "0 6px 25px rgba(212, 175, 55, 0.5)",
              transform: "translateY(-2px)",
            },
            "&.Mui-disabled": {
              background: "rgba(212, 175, 55, 0.1)",
              color: "rgba(255, 255, 255, 0.3)",
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} sx={{ color: "#000" }} />
              <Typography variant="button" sx={{ color: "#000" }}>
                Analyzing Risk...
              </Typography>
            </Box>
          ) : (
            "GENERATE ANALYSIS"
          )}
        </Button>
      </Tooltip>

      {/* Luxury Error Feedback */}
      {error && (
        <Fade in={!!error}>
          <Box 
            sx={{ 
              mt: 2, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 1,
              color: "error.main",
              bgcolor: "rgba(211, 47, 47, 0.1)",
              p: 1,
              borderRadius: 1,
              border: "1px solid rgba(211, 47, 47, 0.3)"
            }}
          >
            <ErrorOutline fontSize="small" />
            <Typography variant="caption">{error}</Typography>
          </Box>
        </Fade>
      )}

      {!loading && !error && (
        <Typography 
          variant="caption" 
          sx={{ display: 'block', mt: 1.5, color: "rgba(212, 175, 55, 0.5)", fontStyle: 'italic' }}
        >
          Secured by Tier-1 AI Verification
        </Typography>
      )}
    </Box>
  );
}