import React, { useState, useEffect } from "react";
import AdminSidebar from "../Components/admin/AdminSidebar";
import Footer from "../Components/Footer";
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login"); 
  };
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Thanh Header */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>Admin Dashboard</Typography>
          </Box>


          <Box sx={{ display: "flex", gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>Hello, <strong>{username}</strong> 👋</Typography>
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

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Nội dung chính */}
      <main style={{ marginTop: 64, paddingLeft: 260, padding: "20px", minHeight: "90vh" }}>
        {children}
      </main>
      <Footer />
    </Box>
  );
};

export default AdminLayout;
