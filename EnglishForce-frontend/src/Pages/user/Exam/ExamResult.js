import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import {
  CheckCircleOutline,
  CancelOutlined
} from '@mui/icons-material';
import { green, red } from '@mui/material/colors';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';

const ExamResultPage = () => {
  const { publicId } = useParams();
  const location = useLocation();
  const selectedAnswers = location.state?.selectedAnswers || [];

  const [result, setResult] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/exams/attempts/result/${publicId}`)
      .then(res => setResult(res.data))
      .catch(err => console.error('Error fetching result', err));
  }, [publicId]);

  if (!result) return <CircularLoading />;

  let questionCounter = 1; // To keep global question number (Q1, Q2, ...)

  const renderPartRecursive = (part, partIndexPath = '') => {
    return (
      <Box key={part.public_id} mt={4}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {partIndexPath} {part.name}
        </Typography>

        {part.Questions?.map((q) => {
          const userData = selectedAnswers.find(
            s => s.question_public_id === q.public_id
          );
          const userAnswers = userData?.selected_answers || [];
          const correctAnswers = (q.Answers || []).map(a => a.content);

          const isCorrect =
            userAnswers.length === correctAnswers.length &&
            [...userAnswers].sort().join(',') ===
              [...correctAnswers].sort().join(',');

          const questionLabel = `Q${questionCounter++}`;

          return (
            <Paper key={q.public_id} sx={{ p: 2, my: 1 }}>
              <Typography variant="h6">
                {questionLabel}. {q.content}{' '}
                {isCorrect ? (
                  <CheckCircleOutline sx={{ color: green[500], ml: 1 }} />
                ) : (
                  <CancelOutlined sx={{ color: red[500], ml: 1 }} />
                )}
              </Typography>
              <Typography>
                Your answer: {userAnswers.join(', ') || 'N/A'}
              </Typography>
              <Typography>
                Correct answer: {correctAnswers.join(', ')}
              </Typography>
            </Paper>
          );
        })}

        {part.Children?.map((child, idx) =>
          renderPartRecursive(child, `${partIndexPath}${idx + 1}.`)
        )}

        <Divider sx={{ my: 3 }} />
      </Box>
    );
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Your Score: {Number(result.score)} / 100
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Exam Duration: {result.duration} minutes
      </Typography>

      {result.parts.map((part, idx) =>
        renderPartRecursive(part, `${idx + 1}.`)
      )}
    </Box>
  );
};

export default ExamResultPage;
