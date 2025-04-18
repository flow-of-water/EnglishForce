import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, Paper } from '@mui/material';

const ExamResultPage = () => {
  const { publicId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/exams/attempts/result/${publicId}`)
      .then(res => setResult(res.data))
      .catch(err => console.error('Error fetching result', err));
  }, [publicId]);

  if (!result) return <Typography>Loading...</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4">Your Score: {result.score} / 100</Typography>
      <Typography variant="subtitle1">Duration: {result.duration} minutes</Typography>

      {result.questions.map((q, index) => (
        <Paper key={q.public_id} sx={{ p: 2, my: 2 }}>
          <Typography variant="h6">Q{index + 1}. {q.content}</Typography>
          <Typography>Your answer: {q.selected_answers.join(', ')}</Typography>
          <Typography>Correct answer: {q.correct_answers.join(', ')}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ExamResultPage;
