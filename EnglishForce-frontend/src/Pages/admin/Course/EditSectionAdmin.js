import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const EditCourseSection = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin section từ backend
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/course_sections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSection(response.data);
      } catch (err) {
        console.error("Error fetching section:", err);
        setError("Error fetching section details");
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id]);

  // Xử lý thay đổi các trường trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gửi dữ liệu cập nhật lên backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/course_sections/${id}`, section);
      navigate(-1); // Quay lại trang trước đó sau khi cập nhật thành công
    } catch (err) {
      console.error("Error updating section:", err);
      setError("Error updating section");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!section) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Section not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Course Section
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Section Name"
            fullWidth
            margin="normal"
            name="name"
            value={section.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            value={section.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            label="Video Link"
            fullWidth
            margin="normal"
            name="video_link"
            value={section.video_link}
            onChange={handleChange}
          />
          <TextField
            label="Order Index"
            fullWidth
            margin="normal"
            name="order_index"
            type="number"
            value={section.order_index}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCourseSection;
