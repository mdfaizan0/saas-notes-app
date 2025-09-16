// src/pages/About.jsx
import React from "react";
import { Container, Paper, Typography, Box } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: "12px",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}
        >
          About NoteSphere
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
            NoteSphere is a modern note-taking and tenant management
            application designed to help you stay organized and productive.
            Whether you're managing personal notes or handling multiple tenants,
            NoteSphere provides a simple yet powerful solution.
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Built with the latest technologies, NoteSphere is fast, responsive,
            and user-friendly — so you can focus on what matters most.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;