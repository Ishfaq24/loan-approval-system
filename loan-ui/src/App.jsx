import React, { useState, useMemo } from "react";
import {
  Container,
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Box,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  InputAdornment,
  Divider,
  Paper,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  Home,
  BusinessCenter,
  Stars,
  AttachMoney,
  Person,
  School,
  Work,
} from "@mui/icons-material";

import Predict from "./components/Predict";

// --- CUSTOM GOLDEN INDUSTRY THEME ---
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D4AF37", // Metallic Gold
      light: "#F9E498",
      dark: "#AF891B",
    },
    background: {
      default: "#0A0A0A", // Rich Black
      paper: "#161616", // Dark Grey/Black
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.5px" },
    h6: { color: "#D4AF37", fontWeight: 600, textTransform: "uppercase", fontSize: "0.9rem" },
  },
  shape: { borderRadius: 12 },
});

export default function App() {
  const [form, setForm] = useState({
    no_of_dependents: 1,
    education: "Graduate",
    self_employed: "No",
    income_annum: 9000000,
    loan_amount: 20000000,
    loan_term: 12,
    cibil_score: 800,
    residential_assets_value: 10000000,
    commercial_assets_value: 5000000,
    luxury_assets_value: 20000000,
    bank_asset_value: 8000000,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Helper for Input Grouping
  const InputSection = ({ title, icon, children }) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Grid container spacing={2.5}>
        {children}
      </Grid>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: "100vh", 
        background: "radial-gradient(circle at top right, #1a1a1a, #000000)",
        py: 6 
      }}>
        <Container maxWidth="lg">
          
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" sx={{ color: "primary.main", mb: 1 }}>
              PREMIUM LOAN ANALYTICS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AI-Powered Credit Risk Assessment System
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* FORM SECTION */}
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  background: "rgba(22, 22, 22, 0.8)",
                  backdropFilter: "blur(10px)"
                }}
              >
                {/* Personal & Employment */}
                <InputSection title="Personal Profile" icon={<Person color="primary" />}>
                  <Grid item xs={4}>
                    <TextField label="Dependents" name="no_of_dependents" type="number" fullWidth value={form.no_of_dependents} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField select label="Education" name="education" fullWidth value={form.education} onChange={handleChange}>
                      <MenuItem value="Graduate">Graduate</MenuItem>
                      <MenuItem value="Not Graduate">Not Graduate</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField select label="Self Employed" name="self_employed" fullWidth value={form.self_employed} onChange={handleChange}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  </Grid>
                </InputSection>

                {/* Loan Details */}
                <InputSection title="Financial Request" icon={<AttachMoney color="primary" />}>
                  <Grid item xs={6}>
                    <TextField label="Annual Income" name="income_annum" fullWidth value={form.income_annum} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Loan Amount" name="loan_amount" fullWidth value={form.loan_amount} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Loan Term (Months)" name="loan_term" fullWidth value={form.loan_term} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="CIBIL Score" name="cibil_score" fullWidth value={form.cibil_score} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Stars sx={{color: '#FFD700'}} /></InputAdornment> }} />
                  </Grid>
                </InputSection>

                {/* Assets */}
                <InputSection title="Asset Valuation" icon={<AccountBalance color="primary" />}>
                  {[
                    { name: "residential_assets_value", label: "Residential", icon: <Home fontSize="small" /> },
                    { name: "commercial_assets_value", label: "Commercial", icon: <BusinessCenter fontSize="small" /> },
                    { name: "luxury_assets_value", label: "Luxury Items", icon: <TrendingUp fontSize="small" /> },
                    { name: "bank_asset_value", label: "Liquid Assets", icon: <AccountBalance fontSize="small" /> },
                  ].map((field) => (
                    <Grid item xs={6} key={field.name}>
                      <TextField
                        label={field.label}
                        name={field.name}
                        fullWidth
                        value={form[field.name]}
                        onChange={handleChange}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                      />
                    </Grid>
                  ))}
                </InputSection>

                <Box mt={2}>
                  <Predict formData={form} setResult={setResult} />
                </Box>
              </Paper>
            </Grid>

            {/* RESULT SECTION */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: "sticky", top: 24 }}>
                {result ? (
                  <Card 
                    sx={{ 
                      border: "2px solid",
                      borderColor: result.approval === "Approved" ? "primary.main" : "error.main",
                      background: "rgba(212, 175, 55, 0.05)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" gutterBottom>Analysis Verdict</Typography>
                      
                      <Box sx={{ my: 3, textAlign: "center" }}>
                        <Typography variant="h3" sx={{ color: result.approval === "Approved" ? "primary.main" : "error.main", fontWeight: 900 }}>
                          {result.approval.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confidence Score: {(result.probability * 100).toFixed(1)}%
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: "rgba(212, 175, 55, 0.2)" }} />

                      {/* Feature Impact - SHAP */}
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.8rem' }}>AI Decision Drivers</Typography>
                      {Object.entries(result.explanations).map(([key, val]) => (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{key.replaceAll('_', ' ')}</Typography>
                            <Typography variant="caption" color={val > 0 ? "primary.light" : "error.main"}>
                              {val > 0 ? "+" : ""}{(val * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.abs(val) * 100}
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: "rgba(255,255,255,0.1)",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: val > 0 ? "primary.main" : "error.main"
                              }
                            }}
                          />
                        </Box>
                      ))}

                      {/* Insights */}
                      <Box mt={4} p={2} sx={{ bgcolor: "rgba(0,0,0,0.3)", borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontSize: '0.8rem' }}>Strategic Insights</Typography>
                        {result.insights.map((ins, i) => (
                          <Typography key={i} variant="body2" sx={{ mb: 1, display: 'flex', gap: 1 }}>
                            <span style={{ color: "#D4AF37" }}>•</span> {ins}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Paper 
                    sx={{ 
                      p: 8, 
                      textAlign: "center", 
                      border: "1px dashed rgba(212, 175, 55, 0.3)",
                      background: "transparent"
                    }}
                  >
                    <Typography color="text.secondary">
                      Enter financial data and click predict to generate AI Analysis
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}