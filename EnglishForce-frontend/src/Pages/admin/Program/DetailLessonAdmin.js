import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const DetailLessonAdmin = () => {
  const { lessonPublicId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

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

      {lesson.Exercises?.length > 0 ? (
        lesson.Exercises.map((ex, index) => (
          <Card key={ex.public_id} sx={{ mb: 2 }}
          onClick={()=>navigate(`/admin/lessons/${lessonPublicId}/exercises/${ex.public_id}`)}
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
