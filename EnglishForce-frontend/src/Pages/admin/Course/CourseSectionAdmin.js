import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Paper, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axiosInstance from "../../../Api/axiosInstance";


const mockSections = [
    { id: 1, name: "Introduction", description: "Overview of the course", course_id: 101, video_link: "https://youtube.com/example1", order_index: 1 },
    { id: 2, name: "Getting Started", description: "Setting up the environment", course_id: 101, video_link: "https://youtube.com/example2", order_index: 2 },
    { id: 3, name: "Advanced Topics", description: "Deep dive into concepts", course_id: 101, video_link: "https://youtube.com/example3", order_index: 3 }
  ];

const AdminCourseSections = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState(mockSections);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [orderIndex, setOrderIndex] = useState(0) ;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");



  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`/course_sections/course/${id}`);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };
  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async () => {
    try {
      const response = await axiosInstance.post(
        "/course_sections",
        { name, description, video_link: videoLink, course_id: id , order_index :orderIndex}
      );
      setSections([...sections, response.data]);
      setSnackbarMessage("Section added successfully!");
      setOpenSnackbar(true);
      setName("");
      setDescription("");
      setVideoLink("");
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      await axiosInstance.delete(`/course_sections/${id}`);
      setSections(sections.filter((s) => s.id !== id));
      setSnackbarMessage("Section deleted!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4">Manage Course Sections</Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleAddSection(); }}>
          <TextField label="Section Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
          <TextField label="Description" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" required />
          <TextField label="Order Index" fullWidth value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} margin="normal" type="number" required />
          <TextField label="Video Link" fullWidth value={videoLink} onChange={(e) => setVideoLink(e.target.value)} margin="normal" />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Section</Button>
        </form>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Order Index</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.id}</TableCell>
                <TableCell>{section.name}</TableCell>
                <TableCell>{section.description}</TableCell>
                <TableCell><a href={section.video_link} target="_blank" rel="noopener noreferrer">Watch</a></TableCell>
                <TableCell>{section.order_index}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/admin/courses/sections/${section.id}/edit`)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteSection(section.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCourseSections;
