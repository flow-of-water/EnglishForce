import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { PersonOutline, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import OAuthLoginButtons from "../../Components/OAuthLoginButtons.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.username === "") {
      alert("Please enter username");
      return;
    }
    if (formData.password === "") {
      alert("Please enter password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        username: formData.username,
        password: formData.password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response && error.response.data)
        alert("Username already exists. Please choose another username!");
      else {
        alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
        alert(`${formData.username}  ${formData.password}`);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        px: 2,
        "&:before": {
          content: '""',
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(800px 320px at 15% 0%, rgba(33,150,243,0.18), transparent 60%), radial-gradient(700px 280px at 90% 10%, rgba(156,39,176,0.16), transparent 60%)",
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backdropFilter: "blur(8px)",
            background: "linear-gradient(145deg,#ffffff 0%,#f9fbff 100%)",
            border: "1px solid rgba(25,118,210,0.12)",
            boxShadow: "0 18px 60px rgba(33,150,243,0.12)",
          }}
        >
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight={900} gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Start your learning journey in seconds
            </Typography>
          </Box>

          <Box component="form" noValidate onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="User Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 3, backgroundColor: "#fff" },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end" aria-label="toggle password visibility">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 3, backgroundColor: "#fff" },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPw ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPw((s) => !s)}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showConfirmPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 3, backgroundColor: "#fff" },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 2.5,
                py: 1.2,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 900,
                boxShadow: "0 12px 28px rgba(33,150,243,0.25)",
                "&:hover": { boxShadow: "0 16px 36px rgba(33,150,243,0.32)" },
              }}
              type="submit"
            >
              Register
            </Button>

            <Divider sx={{ my: 3 }}>or sign up with</Divider>

            <OAuthLoginButtons />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
