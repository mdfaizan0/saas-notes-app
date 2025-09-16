// src/pages/Home.jsx
import React, { useEffect } from "react";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "white",
        borderRadius: "12px",
        boxShadow: 3,
        p: 4,
        mt: 4,
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        gutterBottom
        sx={{ textAlign: "center", color: "primary.main" }}
      >
        Welcome to NoteSphere
      </Typography>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", mb: 4, color: "text.secondary" }}
      >
        Organize your notes, stay productive, and manage tenants with ease.
      </Typography>

      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
          sx={{ px: 4, py: 1.5, borderRadius: "8px", fontWeight: 600 }}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/register"
          sx={{ px: 4, py: 1.5, borderRadius: "8px", fontWeight: 600 }}
        >
          Register
        </Button>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/create-tenant"
          sx={{ px: 4, py: 1.5, borderRadius: "8px", fontWeight: 600 }}
        >
          Create Tenant
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;