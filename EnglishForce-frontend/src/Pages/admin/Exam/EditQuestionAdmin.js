import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const questionTypes = [
  { value: "single_choice", label: "Single Choice" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "listening", label: "Listening" },
  { value: "reading", label: "Reading" },
];

const EditQuestionAdmin = () => {
  const { publicId } = useParams(); // question public_id
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState({
    content: "",
    type: "single_choice",
    thumbnail: "",
    record: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axiosInstance.get(`/questions/${publicId}`);
        setQuestionData(res.data);
      } catch (err) {
        console.error("Error fetching question", err);
        setSnackbar({ open: true, message: "Failed to load question", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [publicId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/questions/${publicId}`, questionData);
      setSnackbar({ open: true, message: "Updated successfully!", severity: "success" });
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      console.error("Update failed", err);
      setSnackbar({ open: true, message: "Failed to update", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Question</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="content"
            label="Content"
            value={questionData.content}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            name="type"
            label="Type"
            value={questionData.type}
            onChange={handleChange}
            margin="normal"
          >
            {questionTypes.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            name="thumbnail"
            label="Thumbnail URL"
            value={questionData.thumbnail}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="record"
            label="Audio URL (Record)"
            value={questionData.record}
            onChange={handleChange}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default EditQuestionAdmin;
