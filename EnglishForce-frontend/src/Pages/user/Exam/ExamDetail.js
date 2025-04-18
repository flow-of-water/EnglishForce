import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, Button } from '@mui/material';

const ExamDetailPage = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/exams/${publicId}`)
      .then(res => setExam(res.data))
      .catch(err => console.error('Failed to fetch exam details', err));
  }, [publicId]);

  if (!exam) return <Typography>Loading...</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h3">{exam.name}</Typography>
      <Typography variant="subtitle1">Duration: {exam.duration} minutes</Typography>
      <Typography paragraph>{exam.description}</Typography>

      <Button variant="contained" component={Link} to={`/exams/${publicId}/start`}>
        Start Exam
      </Button>
    </Box>
  );
};
export default ExamDetailPage;