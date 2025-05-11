import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Pagination
} from '@mui/material';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Dự phòng nếu sau này có pagination

  const fetchPrograms = async () => {
    try {
      const res = await axiosInstance.get(`/programs/status`);
      setPrograms(res.data); // array
    } catch (err) {
      console.error('Failed to fetch programs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page]);

  const getChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="✅ Completed" color="success" size="small" />;
      case 'in_progress':
        return <Chip label="⏳ In progress" color="warning" size="small" />;
      default:
        return null;
        // return <Chip label="📌 Not started" variant="outlined" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Learning Programs
      </Typography>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.public_id}>
            <Card
              component={Link}
              to={`/programs/${program.public_id}`}
              sx={{ textDecoration: 'none' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {program.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {program.description}
                </Typography>
                {getChip(program.progressStatus)}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {program.learnedLessons}/{program.totalLessons} {program.totalLessons>1?"lessons":"lesson"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {programs.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1">No learning programs available.</Typography>
          </Grid>
        )}
      </Grid>

      {/* Pagination nếu cần */}
      {/* <Stack alignItems="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack> */}
    </Box>
  );
};

export default ProgramPage;
