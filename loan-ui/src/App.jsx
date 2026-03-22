import React, { useState } from "react";
import {
  Container, Grid, TextField, Card, Typography, MenuItem, Box,
  LinearProgress, ThemeProvider, createTheme, CssBaseline, Chip, Avatar,
  Divider
} from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { motion, AnimatePresence } from "framer-motion";
import Predict from "./components/Predict";

const theme = createTheme({
  palette: {
    primary: { main: "#c28e2e" },
    background: { default: "#f7f6f3" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    label: { fontSize: "0.7rem", fontWeight: 700, color: "#888", letterSpacing: "1px" }
  },
});

const inputStyle = {
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
    borderRadius: "10px",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    "& fieldset": { border: "1.5px solid #eee", transition: "all 0.2s ease" },
    "&:hover fieldset": { borderColor: "#c28e2e" },
    "&.Mui-focused fieldset": { borderColor: "#c28e2e", borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": { display: "none" },
  mb: 0
};

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

export default function App() {
  const [form, setForm] = useState({
    no_of_dependents: 1, education: "Graduate", self_employed: "No",
    income_annum: 9000000, loan_amount: 20000000, loan_term: 12,
    cibil_score: 800, residential_assets_value: 10000000,
    commercial_assets_value: 5000000, luxury_assets_value: 20000000, bank_asset_value: 8000000,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isApproved = result?.approval === "Approved";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f6f3 0%, #eee9df 100%)" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>

          {/* HEADER */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{
                bgcolor: 'transparent',
                background: 'linear-gradient(135deg, #c28e2e 0%, #e6b94f 100%)',
                width: 44, height: 44,
                boxShadow: '0 4px 14px rgba(194, 142, 46, 0.35)'
              }}>
                <AccountBalanceIcon sx={{ fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                  LoanSense <span style={{ color: '#c28e2e' }}>AI</span>
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#999', fontWeight: 500, letterSpacing: '0.5px' }}>
                  Intelligent Loan Approval System
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<AutoGraphIcon sx={{ fontSize: 16 }} />}
              label="AI Powered"
              size="small"
              sx={{
                bgcolor: 'rgba(194,142,46,0.1)', color: '#c28e2e',
                fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.5px',
                border: '1px solid rgba(194,142,46,0.2)'
              }}
            />
          </Box>

          {/* TITLE */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ mb: 1, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
              Predict Loan Approval{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(90deg, #b8860b, #daa520)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Instantly</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 550, lineHeight: 1.7, fontSize: '0.95rem' }}>
              Enter the applicant's financial profile to receive an AI-powered approval prediction with risk analysis and actionable insights.
            </Typography>
          </Box>

          {/* MAIN GRID — ALWAYS SIDE BY SIDE */}
          <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>

            {/* LEFT: FORM */}
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  p: { xs: 3, sm: 4 }, borderRadius: 4,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                  border: '1px solid rgba(0,0,0,0.04)',
                  background: '#fff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                  <Avatar sx={{
                    background: 'linear-gradient(135deg, #c28e2e, #e6b94f)',
                    width: 34, height: 34
                  }}>
                    <AccountBalanceIcon sx={{ fontSize: 17 }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a1a1a' }}>Applicant Details</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#aaa' }}>Fill in all fields for accurate prediction</Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3, borderColor: '#f0f0f0' }} />

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="label">EDUCATION</Typography>
                    <TextField select name="education" fullWidth value={form.education} onChange={handleChange} sx={inputStyle}>
                      <MenuItem value="Graduate">Graduate</MenuItem>
                      <MenuItem value="Not Graduate">Not Graduate</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">SELF EMPLOYED</Typography>
                    <TextField select name="self_employed" fullWidth value={form.self_employed} onChange={handleChange} sx={inputStyle}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">NO. OF DEPENDENTS</Typography>
                    <TextField name="no_of_dependents" fullWidth value={form.no_of_dependents} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">ANNUAL INCOME (₹)</Typography>
                    <TextField name="income_annum" fullWidth value={form.income_annum} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">LOAN AMOUNT (₹)</Typography>
                    <TextField name="loan_amount" fullWidth value={form.loan_amount} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">LOAN TERM (MONTHS)</Typography>
                    <TextField name="loan_term" fullWidth value={form.loan_term} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">CIBIL SCORE</Typography>
                    <TextField name="cibil_score" fullWidth value={form.cibil_score} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">RESIDENTIAL ASSETS (₹)</Typography>
                    <TextField name="residential_assets_value" fullWidth value={form.residential_assets_value} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">COMMERCIAL ASSETS (₹)</Typography>
                    <TextField name="commercial_assets_value" fullWidth value={form.commercial_assets_value} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="label">LUXURY ASSETS (₹)</Typography>
                    <TextField name="luxury_assets_value" fullWidth value={form.luxury_assets_value} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="label">BANK ASSETS (₹)</Typography>
                    <TextField name="bank_asset_value" fullWidth value={form.bank_asset_value} onChange={handleChange} sx={inputStyle} />
                  </Grid>
                </Grid>

                <Predict formData={form} setResult={setResult} />

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <SecurityIcon sx={{ fontSize: 13, color: '#ccc' }} />
                  <Typography sx={{ fontSize: '0.68rem', color: '#bbb', fontStyle: 'italic' }}>
                    Secured by Tier-1 AI Verification
                  </Typography>
                </Box>
              </MotionCard>
            </Grid>

            {/* RIGHT: RESULTS — ALWAYS VISIBLE */}
            <Grid size={{ xs: 12, md: 6, lg: 7 }}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <AnimatePresence mode="wait">
                  {!result ? (
                    /* PLACEHOLDER STATE */
                    <MotionCard
                      key="placeholder"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      sx={{
                        p: { xs: 4, sm: 6 }, borderRadius: 4,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                        border: '1px solid rgba(0,0,0,0.04)',
                        background: '#fff',
                        minHeight: 520,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <Box sx={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(194,142,46,0.08), rgba(194,142,46,0.18))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 3
                      }}>
                        <QueryStatsIcon sx={{ fontSize: 36, color: '#c28e2e' }} />
                      </Box>
                      <Typography variant="h5" sx={{ color: '#1a1a1a', mb: 1 }}>
                        Analysis Results
                      </Typography>
                      <Typography sx={{ color: '#aaa', fontSize: '0.9rem', maxWidth: 320, lineHeight: 1.7, mb: 4 }}>
                        Fill in the applicant details and click <strong style={{ color: '#c28e2e' }}>Generate Analysis</strong> to see the AI-powered prediction with SHAP explanations.
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                          { icon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />, label: 'Approval Decision' },
                          { icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, label: 'Risk Analysis' },
                          { icon: <InsightsIcon sx={{ fontSize: 20 }} />, label: 'SHAP Insights' },
                        ].map((item) => (
                          <Box key={item.label} sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                            px: 2.5, py: 2, borderRadius: 3,
                            bgcolor: '#fafaf8', border: '1px solid #f0ede6',
                            minWidth: 120
                          }}>
                            <Box sx={{ color: '#c28e2e' }}>{item.icon}</Box>
                            <Typography sx={{ fontSize: '0.73rem', fontWeight: 600, color: '#999' }}>
                              {item.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </MotionCard>
                  ) : (
                    /* ACTUAL RESULTS */
                    <MotionCard
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      sx={{
                        p: { xs: 3, sm: 4 }, borderRadius: 4,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                        border: '1px solid rgba(0,0,0,0.04)',
                        background: '#fff'
                      }}
                    >
                      {/* Result Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                        <Avatar sx={{
                          width: 34, height: 34,
                          bgcolor: isApproved ? '#f0fdf4' : '#fef2f2',
                        }}>
                          {isApproved
                            ? <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                            : <HighlightOffIcon sx={{ color: '#dc2626', fontSize: 20 }} />
                          }
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a1a1a' }}>Prediction Result</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#aaa' }}>AI-generated analysis</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 3, borderColor: '#f0f0f0' }} />

                      {/* Decision Banner */}
                      <MotionBox
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        sx={{
                          background: isApproved
                            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                            : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                          p: 3, borderRadius: 3, mb: 3,
                          border: `1.5px solid ${isApproved ? '#bbf7d0' : '#fecaca'}`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', letterSpacing: '1px', mb: 0.5 }}>DECISION</Typography>
                          <Typography variant="h4" sx={{
                            color: isApproved ? '#16a34a' : '#dc2626',
                            fontWeight: 900, mb: 1, lineHeight: 1
                          }}>
                            {result.approval}
                          </Typography>
                          <Chip
                            label={result.risk_level || (isApproved ? "Low Risk" : "High Risk")}
                            size="small"
                            sx={{
                              bgcolor: isApproved ? '#16a34a' : '#dc2626',
                              color: '#fff', fontWeight: 700, fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        </Box>
                        <Box textAlign="right">
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', letterSpacing: '1px', mb: 0.5 }}>CONFIDENCE</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
                            {(result.probability * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </MotionBox>

                      {/* SHAP BARS */}
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 16, color: '#c28e2e' }} />
                          <Typography variant="label">FEATURE IMPACT (SHAP)</Typography>
                        </Box>
                        {Object.entries(result.explanations).map(([key, val], index) => (
                          <MotionBox
                            key={key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
                            sx={{ mb: 2 }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', textTransform: 'capitalize', color: '#555' }}>
                                {key.replaceAll('_', ' ')}
                              </Typography>
                              <Typography sx={{
                                fontWeight: 700, fontSize: '0.82rem',
                                color: val > 0 ? '#16a34a' : '#dc2626'
                              }}>
                                {val > 0 ? "+" : ""}{val.toFixed(3)}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(Math.abs(val) * 100, 100)}
                              sx={{
                                height: 7, borderRadius: 4, bgcolor: '#f5f5f3',
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 4,
                                  background: val > 0
                                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                    : 'linear-gradient(90deg, #f87171, #dc2626)',
                                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                }
                              }}
                            />
                          </MotionBox>
                        ))}
                      </MotionBox>

                      <Divider sx={{ my: 3, borderColor: '#f0f0f0' }} />

                      {/* INSIGHTS */}
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                          <InsightsIcon sx={{ fontSize: 16, color: '#c28e2e' }} />
                          <Typography variant="label">KEY INSIGHTS</Typography>
                        </Box>
                        {result.insights.map((ins, i) => (
                          <MotionBox
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55 + i * 0.07, duration: 0.3 }}
                            sx={{
                              bgcolor: '#fafaf8', p: 2, borderRadius: 2.5, mb: 1.5,
                              display: 'flex', alignItems: 'flex-start', gap: 1.5,
                              border: '1px solid #f0ede6',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: '#f5f3ed',
                                borderColor: '#e5dfd3',
                                transform: 'translateX(4px)'
                              }
                            }}
                          >
                            <Box sx={{
                              width: 7, height: 7, borderRadius: '50%',
                              background: 'linear-gradient(135deg, #c28e2e, #e6b94f)',
                              mt: 0.8, flexShrink: 0
                            }} />
                            <Typography sx={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>{ins}</Typography>
                          </MotionBox>
                        ))}
                      </MotionBox>
                    </MotionCard>
                  )}
                </AnimatePresence>
              </Box>
            </Grid>

          </Grid>

          {/* FOOTER */}
          <Box sx={{ mt: 6, textAlign: 'center', pb: 2 }}>
            <Typography sx={{ fontSize: '0.72rem', color: '#bbb' }}>
              © 2025 LoanSense AI · Built with FastAPI, XGBoost & React
            </Typography>
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
