import React from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import Header from "../Components/user/Header";
import Footer from "../Components/Footer";
import Chatbot from "../Components/user/ChatBot";

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
          <Box
      sx={{
        height: '90vh',  // full viewport height
        width: '100%',
        position: 'relative',
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`, 
        // backgroundImage: `url('https://i.pinimg.com/736x/ab/68/f6/ab68f66366b2582b000aedd27f20ed70.jpg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      {/* Overlay đen mờ */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      />

      {/* Nội dung hero */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to English Force
        </Typography>
        <Typography variant="h5" paragraph>
          Your ultimate platform for effective and fun English learning.
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
          Get Started
        </Button>
      </Container>
    </Box>


        {children}
      <Chatbot />
      <Footer />
    </Box>
  );
};

export default Layout;
