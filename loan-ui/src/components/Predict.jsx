import React, { useState } from "react";
import { predictLoan } from "../api/predict";
import { Button, CircularProgress } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function Predict({ formData, setResult }) {
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await predictLoan(formData);
      setResult(result);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      onClick={handlePredict}
      disabled={loading}
      startIcon={loading ? undefined : <RocketLaunchIcon sx={{ fontSize: 18 }} />}
      sx={{
        mt: 3,
        py: 1.6,
        borderRadius: "10px",
        fontWeight: 800,
        fontSize: '0.85rem',
        letterSpacing: "1px",
        background: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #c28e2e 100%)",
        boxShadow: "0 4px 20px rgba(184, 134, 11, 0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          background: "linear-gradient(135deg, #daa520 0%, #c28e2e 50%, #b8860b 100%)",
          boxShadow: "0 6px 28px rgba(184, 134, 11, 0.45)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0px)",
        },
        "&.Mui-disabled": {
          background: "linear-gradient(135deg, #d4c49a 0%, #e0cc8a 100%)",
          color: "rgba(255,255,255,0.7)"
        },
        color: "white"
      }}
    >
      {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "GENERATE ANALYSIS"}
    </Button>
  );
}
