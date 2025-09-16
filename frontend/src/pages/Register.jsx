import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api"; // ✅ import base URL

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMatch) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("✅ Registered:", data);
      // redirect to login
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced password match check
  useEffect(() => {
    if (!password || !confirm) {
      setIsMatch(false);
      return;
    }

    setChecking(true);
    const timer = setTimeout(() => {
      setIsMatch(password === confirm);
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [password, confirm]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: "16px",
          border: "2px solid",
          borderColor: "secondary.main",
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ color: "secondary.main" }}
        >
          Create Your Account
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          gutterBottom
          sx={{ color: "text.secondary", mb: 3 }}
        >
          Join NoteSphere and start organizing smarter.
        </Typography>

        {errorMsg && (
          <Typography
            variant="body2"
            sx={{ color: "error.main", textAlign: "center", mb: 2 }}
          >
            {errorMsg}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={confirm.length > 0 && !isMatch && !checking}
              helperText={
                confirm.length > 0 && !isMatch && !checking
                  ? "Passwords do not match"
                  : " "
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: "8px", fontWeight: 600 }}
              fullWidth
              disabled={!isMatch || checking || loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </form>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          Already have an account?{" "}
          <MuiLink
            component={Link}
            to="/login"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Login here
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;