import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, Paper } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import { green, red } from '@mui/material/colors';


const ExamResultPage = () => {
  const { publicId } = useParams();
  const [result, setResult] = useState(null);
  const location = useLocation();
  const selectedAnswers = location.state?.selectedAnswers || {};

  useEffect(() => {
    axiosInstance.get(`/exams/attempts/result/${publicId}`)
      .then(res => setResult(res.data))
      .catch(err => console.error('Error fetching result', err));
    console.log(selectedAnswers)
  }, [publicId]);

  if (!result) return <Typography>Loading...</Typography>;

  return (

    <Box p={4}>
      <Typography variant="h4">Your Score: {result.score} / 100</Typography>
      <Typography variant="subtitle1">Duration: {result.duration} minutes</Typography>

      {result.questions.map((q, index) => {
        const userAnswerData = selectedAnswers.find(s => s.question_public_id === q.public_id);
        const userAnswers = userAnswerData?.selected_answers || [];
        const correctAnswers = q.correct_answers || [];

        // So sánh mảng (bất kể thứ tự)
        const isCorrect =
          userAnswers.length === correctAnswers.length &&
          [...userAnswers].sort().join(',') === [...correctAnswers].sort().join(',');

        return (
          <Paper key={q.public_id} sx={{ p: 2, my: 2 }}>
            <Typography variant="h6">
              Q{index + 1}. {q.content}{' '}
              {isCorrect ? (
                <CheckCircleOutline sx={{ color: green[500], ml: 1 }} />
              ) : (
                <CancelOutlined sx={{ color: red[500], ml: 1 }} />
              )}
            </Typography>
            <Typography>Your answer: {userAnswers.join(', ') || 'N/A'}</Typography>
            <Typography>Correct answer: {correctAnswers.join(', ')}</Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ExamResultPage;
