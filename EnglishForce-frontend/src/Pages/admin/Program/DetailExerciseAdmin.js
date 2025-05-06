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
  Chip
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const DetailExerciseAdmin = () => {
  const { publicExerciseId } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const res = await axiosInstance.get(`/exercises/${publicExerciseId}`);
        setExercise(res.data);
      } catch (err) {
        console.error('Failed to fetch exercise detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [publicExerciseId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!exercise) {
    return (
      <Typography variant="h6" align="center" color="error" mt={5}>
        Exercise not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Exercise Detail</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/exercises/edit/${exercise.public_id}`)}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>{exercise.question}</Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Type: <strong>{exercise.type}</strong>
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Order Index: <strong>{exercise.order_index}</strong>
      </Typography>

      {exercise.thumbnail && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Thumbnail:</Typography>
          <img
            src={exercise.thumbnail}
            alt="Exercise Thumbnail"
            style={{ width: '100%', borderRadius: 4 }}
          />
        </Box>
      )}

      {exercise.record && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2">Audio:</Typography>
          <audio controls src={exercise.record} style={{ width: '100%' }} />
        </Box>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>Answers</Typography>
      {exercise.ExerciseAnswers?.length > 0 ? (
        exercise.ExerciseAnswers.map((answer, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">{answer.content}</Typography>
              {answer.is_correct && (
                <Chip label="Correct" color="success" size="small" sx={{ mt: 1 }} />
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No answers available.
        </Typography>
      )}
    </Container>
  );
};

export default DetailExerciseAdmin;
