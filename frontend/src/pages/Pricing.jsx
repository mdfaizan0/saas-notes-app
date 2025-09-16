// src/pages/Pricing.jsx
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const Pricing = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Flexible pricing for every workspace. Start free and upgrade anytime.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Free Plan */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "grey.300",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Free
              </Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                ₹0
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  /month
                </Typography>
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                • Store up to 3 notes per tenant  
                • Basic support  
                • Great for personal use
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2, borderRadius: "8px", fontWeight: 600 }}
                fullWidth
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Pro Plan */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              borderRadius: "16px",
              border: "2px solid",
              borderColor: "primary.main",
              boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Pro
              </Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                ₹499
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  /month
                </Typography>
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                • Unlimited notes per tenant  
                • Priority support  
                • Perfect for teams & businesses
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "8px", fontWeight: 600 }}
                fullWidth
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Pricing;