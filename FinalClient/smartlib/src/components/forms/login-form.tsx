import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { ILoginFormValues } from "utils/interfaces";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FaFacebook } from "react-icons/fa";
import "pages/LoginPage/style.css";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string().required().min(8),
});
const theme = createTheme();

const LoginForm = () => {
  const [data, setData] = React.useState<ILoginFormValues>({
    email: "",
    password: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({
    resolver: joiResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<ILoginFormValues> = (data) => {
    console.log(data);
    setData(data);
  };
  const onError = (errors: object) => {
    console.log(
      "🚀 ~ file: login-form.tsx ~ line 46 ~ onError ~ errors",
      errors
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit, onError)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              {...register("email")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              {...register("password")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to={"/register"}>Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <div className="open-authentication-side">
        <Typography variant="h6" color={"#424242"}>
          Or Sign In Using
        </Typography>
        <div className="open-authentication-options">
          <IconButton aria-label="Google" color="info">
            <FcGoogle fontSize={50} />
          </IconButton>
          <IconButton aria-label="Facebook" color="primary">
            <FaFacebook fontSize={50} />
          </IconButton>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginForm;
