import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from "../../Context/CartContext";
import { Link } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { cartItems } = useContext(CartContext);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
          English Force
        </Typography>

        {/* <SearchBar /> */}
        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {isLoggedIn && (role == 'admin') && <Button
            color="inherit" component={Link} to="/admin"
          >Admin</Button>}
          <Button color="inherit" component={Link} to="/programs">Program</Button>
          <Button color="inherit" component={Link} to="/exams">Exams</Button>
          <Button color="inherit" component={Link} to="/courses">Courses</Button>
          {/* <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/contact">Contact</Button> */}

          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/courses-user">My learning</Button>
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                aria-label="cart"
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <Button color="inherit" component={Link} to="/profile">
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center",textTransform: "none", }}>Hello, <strong>{username}</strong> 👋</Typography>
              </Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
