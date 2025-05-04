import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, Button } from '@mui/material';
import CircularLoading from '../../../Components/Loading';

const ExamDetailPage = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);
  const [attempts, setAttempts] = useState([]);


  useEffect(() => {
    const FetchExamAndAttempts = async () => {
      try {
        const response = await axiosInstance.get(`/exams/${publicId}/short`);
        setExam(response.data);

        const attemptRes = await axiosInstance.get(`/exam-attempts/${publicId}/user`);
        setAttempts(attemptRes.data);
      }
      catch (err) { console.error('Failed to fetch exam details', err); }
    }
    FetchExamAndAttempts();
  }, [publicId]);

  if (!exam) return <CircularLoading/>;
  return (
    <Box p={4}>
      <Typography variant="h3">{exam.name}</Typography>
      <Typography variant="subtitle1">Duration: {exam.duration} minutes</Typography>
      <Typography paragraph>{exam.description}</Typography>

      <Button variant="contained" component={Link} to={`/exams/${publicId}/start`}>
        Start Exam
      </Button>


      {attempts.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Your Attempts</Typography>
          {attempts.map((attempt, index) => (
            <Box key={attempt.id} mb={2}>
              <Typography>
                Attempt #{index + 1} – Score: {attempt.score} / 100
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Time: {new Date(attempt.start).toLocaleString()} → {new Date(attempt.end).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
export default ExamDetailPage;