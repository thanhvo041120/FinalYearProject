import * as React from "react";
import {
  Button,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Box,
  Container,
  Toolbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import InformationForm from "./infor-form";
import BookForm from "./book-form";

const steps = ["Individual information", "Book information"];

function changeSteps(step: number) {
  switch (step) {
    case 0:
      return <InformationForm />;
    case 1:
      return <BookForm />;
    default:
      throw new Error("Unknown step");
  }
}

const theme = createTheme();
const BorrowForm = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Smart library
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Receipt
          </Typography>
          <Stepper activeStep={currentStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {currentStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your interest.
                </Typography>
                <Typography variant="subtitle1">
                  Your borrowed book is #2001539. We have emailed your order
                  information.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {changeSteps(currentStep)}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {currentStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {currentStep === steps.length - 1 ? "Borrow" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default BorrowForm;
