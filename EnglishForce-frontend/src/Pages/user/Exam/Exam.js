import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip
} from '@mui/material';
import GradientTitle from '../../../Components/GradientTitle';
import QuizIcon from '@mui/icons-material/Quiz';
import CircularLoading from '../../../Components/Loading';

const ExamPage = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchExams = async (page) => {
    try {
      const res = await axiosInstance.get(`/exams?page=${page}`);
      setExams(res.data.exams);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchExams(page);
  }, [page]);

  if (loading) return <CircularLoading />;

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, minHeight: '100vh' }}>
      <GradientTitle>Available Exams</GradientTitle>

      <Typography align="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
        Explore our curated list of mock exams designed to help you sharpen your English skills and prepare with confidence.
      </Typography>

      <Grid container spacing={4}>
        {exams.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No exams available.
            </Typography>
          </Grid>
        ) : (
          exams.map((exam) => (
            <Grid key={exam.public_id} item xs={12} sm={6} md={4}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 10px 30px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                <CardActionArea component={Link} to={`/exams/${exam.public_id}`} sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <QuizIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        {exam.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {exam.description || 'No description provided.'}
                    </Typography>
                    <Chip label="Start Exam" color="primary" variant="outlined" />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack alignItems="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
};

export default ExamPage;
