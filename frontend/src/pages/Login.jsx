import React, { useEffect, useState } from "react";
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
import API_BASE_URL from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("✅ Login successful:", data);

      // redirect to dashboard or tenant page
      navigate("/dashboard"); // change path as per your app
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: "12px",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          Login to NoteSphere
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: "8px", fontWeight: 600 }}
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          Don’t have an account?{" "}
          <MuiLink
            component={Link}
            to="/register"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Register here
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;