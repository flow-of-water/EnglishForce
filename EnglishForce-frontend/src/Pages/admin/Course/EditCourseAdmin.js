import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Input,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance"; // Đảm bảo đường dẫn đúng với cấu trúc dự án

const EditCourse = () => {
  const { publicId } = useParams(); // Lấy publicId khóa học từ URL
  const navigate = useNavigate();

  // State lưu thông tin khóa học (không bao gồm thumbnail file)
  const [courseData, setCourseData] = useState({
    name: "",
    instructor: "",
    description: "",
    price: null,
  });
  // State lưu file upload mới (nếu có)
  const [thumbnailFile, setThumbnailFile] = useState(null);
  // State lưu ảnh preview dưới dạng chuỗi Base64 (để hiển thị)
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Khi component mount, fetch thông tin khóa học từ API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${publicId}`);
        const data = response.data;
        setCourseData({
          name: data.name || "",
          instructor: data.instructor || "",
          description: data.description || "",
          price: data.price || 0,
        });
        if (data.thumbnail) {
          setImagePreview(data.thumbnail);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [publicId]);

  // Xử lý thay đổi các trường input text
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý upload file ảnh mới và cập nhật preview
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setThumbnailFile(file)
      } catch (error) {
        console.error("Error with image:", error);
      }
    }
  };

  // Gửi dữ liệu cập nhật lên backend qua API PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", courseData.name);
      formData.append("instructor", courseData.instructor);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      await axiosInstance.put(`/courses/${publicId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/admin/courses/${publicId}`);
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Error updating course.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Course
      </Typography>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course Name"
            name="name"
            fullWidth
            margin="normal"
            value={courseData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Instructor"
            name="instructor"
            fullWidth
            margin="normal"
            value={courseData.instructor}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={courseData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            inputProps={{ step: "0.01" }}
            fullWidth
            margin="normal"
            value={courseData.price}
            onChange={handleChange}
            required
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Thumbnail:
          </Typography>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Course Thumbnail"
              style={{ maxWidth: "200px", marginBottom: "10px" }}
            />
          ) : (
            <Typography variant="body2">No thumbnail available</Typography>
          )}
          <br />
          <Input type="file" accept="image/*" onChange={handleFileChange} sx={{ mt: 2 }} />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCourse;
