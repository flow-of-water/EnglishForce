import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const DetailUnitAdmin = () => {
  const { unitPublicId, publicProgramId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnitDetail = async () => {
      try {
        const res = await axiosInstance.get(`/units/${unitPublicId}`);
        setUnit(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch unit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitDetail();
  }, [unitPublicId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!unit) {
    return (
      <Typography variant="h6" align="center" mt={5} color="error">
        Unit not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{unit.name}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/units/${unit.public_id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      {unit.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {unit.description}
        </Typography>
      )}

      {unit.Lessons?.length > 0 ? (
        unit.Lessons.map((lesson, index) => (
          <Card key={lesson.public_id} sx={{ mb: 3 }}
          onClick={() =>
            navigate(`/admin/lessons/${lesson.public_id}`)
        }
          >
            <CardContent>
              <Typography variant="h6">
                Lesson {index + 1}: {lesson.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lesson.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Type: {lesson.type} | Order: {lesson.order_index}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No lessons found for this unit.
        </Typography>
      )}
    </Container>
  );
};

export default DetailUnitAdmin;
