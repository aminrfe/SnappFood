import React from "react";
import { Box, Typography, Stepper, Step, StepLabel, Paper, Divider } from "@mui/material";
import MotorbikeImage from "../../assets/imgs/motorbike.png"; 

const TrackOrderPage = () => {
  const steps = ["در حال آماده سازی", "ارسال شده", "تحویل داده شده"];
  const activeStep = 1; 

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "70%", 
          textAlign: "center",
          padding: "30px", 
          borderRadius: "10px",
          backgroundColor: "#FFEDE0",
        }}
      >
        
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: "1.8rem" }}>
          وضعیت سفارش شما
        </Typography>

     
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            marginBottom: "40px", 
            fontSize: "1.2rem",
          }}
        >
          سفارش شما به ثبت رسید.
        </Typography>

      
        <Box sx={{ marginY: 3 }}>
          <img
            src={MotorbikeImage}
            alt="Motorbike"
            style={{
              width: "250px", 
              height: "auto",
            }}
          />
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepConnector-line": {
              borderColor: (theme) => (theme.palette.mode === "light" ? "#FFA726" : "#FFA726"), 
            },
            marginBottom: "40px", 
          }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: index <= activeStep ? "#FFA726" : "gray", 
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default TrackOrderPage;
