// src/pages/Contact.jsx
import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent!");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
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
          sx={{ textAlign: "center", fontWeight: 700, color: "primary.main" }}
        >
          Contact Us
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField label="Name" name="name" fullWidth required />
            <TextField label="Email" name="email" type="email" fullWidth required />
            <TextField
              label="Message"
              name="message"
              multiline
              rows={4}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: "8px", fontWeight: 600 }}
              fullWidth
            >
              Send Message
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;