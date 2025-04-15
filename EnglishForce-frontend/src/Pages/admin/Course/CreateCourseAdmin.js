import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Paper, Snackbar, Alert, Input,
  InputAdornment 
 } from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const CreateCourseAdmin = () => {
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      setThumbnail(file) ;
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("instructor", instructor);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("price", price);

    try {
      const response = await axiosInstance.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbarMessage("Course created successfully!");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/admin/courses"), 2000);
    } catch (error) {
      console.error("Error creating course:", error);
      setSnackbarMessage("Error creating course, please try again.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" gutterBottom>Create New Course</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Course Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
          <TextField label="Instructor" fullWidth value={instructor} onChange={(e) => setInstructor(e.target.value)} margin="normal" required />
          <TextField label="Description" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" required />
          <TextField label="Price"      fullWidth value={price} onChange={(e) => setPrice(e.target.value)} margin="normal"
            type="number"
            required
            inputProps={{ step: "0.01" }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Input type="file" accept="image/*" onChange={handleFileChange} sx={{ mt: 2 }} />
          <br/>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Create Course</Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes("success") ? "success" : "error"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateCourseAdmin;
