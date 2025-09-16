// src/pages/CreateTenant.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api";

const CreateTenant = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce password match check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPasswordMatch(password && confirmPassword && password === confirmPassword);
    }, 500);
    return () => clearTimeout(timer);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordMatch) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/tenants/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create tenant");

      // Save user and token in localStorage for dashboard login
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token || ""); // If your backend returns token

      alert("Tenant created successfully! Redirecting to dashboard...");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
      <Box
        sx={{
          bgcolor: "white",
          p: 5,
          borderRadius: "20px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ color: "primary.main", letterSpacing: "0.5px" }}
        >
          Create Your Tenant
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          gutterBottom
          sx={{ color: "text.secondary", mb: 3 }}
        >
          Set up your company workspace and start collaborating with <b>NoteSphere</b>.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Your Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              fullWidth
              required
              error={confirmPassword.length > 0 && !isPasswordMatch}
              helperText={
                confirmPassword.length > 0 && !isPasswordMatch
                  ? "Passwords do not match"
                  : " "
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!isPasswordMatch || loading}
              sx={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.2,
                filter: !isPasswordMatch || loading ? "blur(1px)" : "none",
                opacity: !isPasswordMatch || loading ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Create Tenant 🤩"}
            </Button>
          </Stack>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CreateTenant;