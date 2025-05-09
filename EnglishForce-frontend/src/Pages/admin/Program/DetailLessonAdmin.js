import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const DetailLessonAdmin = () => {
  const { lessonPublicId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState({
    name: '',
    description: '',
    type: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonPublicId}`);
        setLesson(res.data);
      } catch (err) {
        console.error('Failed to fetch lesson detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetail();
  }, [lessonPublicId]);

  const handleCreateSection = async () => {
    if (!newSection.name.trim() || !newSection.type.trim()) {
      alert('Please fill in name and type');
      return;
    }

    try {
      setCreating(true);
      const res = await axiosInstance.post('/exercises', {
        lesson_public_id: lessonPublicId,
        ...newSection,
      });

      alert('Exercise section created!');
      setNewSection({ name: '', description: '', type: '' });
      // Reload or update state manually if needed
    } catch (err) {
      console.error('Failed to create section:', err);
      alert('Error creating section');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Typography variant="h6" align="center" color="error" mt={5}>
        Lesson not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{lesson.name}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/lessons/edit/${lesson.public_id}`)}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {lesson.description}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Type: <strong>{lesson.type}</strong>
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Order Index: <strong>{lesson.order_index}</strong>
      </Typography>

      {/* ADD EXERCISE SECTION FORM */}
      <Box sx={{ mb: 4, p: 2, border: '1px dashed gray', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Exercise
        </Typography>

        <TextField
          label="Question"
          value={newSection.question || ""}
          onChange={(e) => setNewSection({ ...newSection, question: e.target.value })}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={newSection.type || "single_choice"}
            onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
            label="Type"
          >
            <MenuItem value="single_choice">Single Choice</MenuItem>
            <MenuItem value="speaking">Speaking</MenuItem>
            <MenuItem value="writing">Writing</MenuItem>
          </Select>
        </FormControl>

        {/* Thumbnail */}
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Thumbnail Mode</FormLabel>
          <RadioGroup
            row
            value={newSection.thumbnailMode || "link"}
            onChange={(e) => setNewSection({ ...newSection, thumbnailMode: e.target.value })}
          >
            <FormControlLabel value="link" control={<Radio />} label="Link" />
            <FormControlLabel value="upload" control={<Radio />} label="Upload" />
          </RadioGroup>
        </FormControl>

        {newSection.thumbnailMode === "upload" ? (
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Thumbnail
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNewSection({ ...newSection, selectedThumbnail: e.target.files[0] })}
              />
            </Button>
          </Box>
        ) : (
          <TextField
            fullWidth
            label="Thumbnail URL"
            value={newSection.thumbnailUrl || ""}
            onChange={(e) => setNewSection({ ...newSection, thumbnailUrl: e.target.value })}
            sx={{ mb: 2 }}
          />
        )}

        {/* Record upload */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Upload Record (optional)
          </Typography>

          {newSection.selectedRecord ? (
            <Box sx={{ mb: 1 }}>
              <Typography fontStyle="italic" color="text.secondary">
                Selected File: {newSection.selectedRecord.name}
              </Typography>
              <audio
                controls
                src={URL.createObjectURL(newSection.selectedRecord)}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Box>
          ) : null}

          <Button variant="outlined" component="label" fullWidth>
            {newSection.selectedRecord ? "Change Audio" : "Upload Audio"}
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={(e) =>
                setNewSection({ ...newSection, selectedRecord: e.target.files[0] })
              }
            />
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (!newSection.question || !newSection.type) {
              alert("Missing required fields");
              return;
            }

            const formData = new FormData();
            formData.append("question", newSection.question);
            formData.append("type", newSection.type);
            formData.append("lesson_public_id", lessonPublicId);

            if (newSection.thumbnailMode === "upload" && newSection.selectedThumbnail) {
              formData.append("thumbnail", newSection.selectedThumbnail);
            } else if (newSection.thumbnailMode === "link" && newSection.thumbnailUrl) {
              formData.append("thumbnail", newSection.thumbnailUrl);
            }

            if (newSection.selectedRecord) {
              formData.append("record", newSection.selectedRecord);
            }

            try {
              await axiosInstance.post("/exercises", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              alert("Exercise created successfully!");
              setNewSection({}); // Reset form
            } catch (err) {
              console.error("Create failed:", err);
              alert("Failed to create exercise");
            }
          }}
        >
          Create Exercise
        </Button>
      </Box>


      {lesson.Exercises?.length > 0 ? (
        lesson.Exercises.map((ex, index) => (
          <Card
            key={ex.public_id}
            sx={{ mb: 2, cursor: 'pointer' }}
            onClick={() =>
              navigate(`/admin/lessons/${lessonPublicId}/exercises/${ex.public_id}`)
            }
          >
            <CardContent>
              <Typography variant="subtitle1">
                Exercise {index + 1}: {ex.question}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Type: {ex.type} | Order: {ex.order_index}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No exercises available for this lesson.
        </Typography>
      )}
    </Container>
  );
};

export default DetailLessonAdmin;
