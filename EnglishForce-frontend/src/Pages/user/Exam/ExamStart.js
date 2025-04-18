import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  Button,
  Checkbox,
  Radio,
  FormControlLabel
} from '@mui/material';

const ExamStartPage = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/exams/${publicId}`)
      .then((res) => setExam(res.data))
      .catch((err) => console.error('Failed to fetch exam details', err));
  }, [publicId]);

  const handleSelectAnswer = (questionId, answerId, type) => {
    setAnswers((prev) => {
      if (type === 'multiple_choice') {
        const current = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: current.includes(answerId)
            ? current.filter((id) => id !== answerId)
            : [...current, answerId],
        };
      } else {
        return {
          ...prev,
          [questionId]: [answerId],
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        exam_public_id: publicId,
        answers: Object.entries(answers).map(([question_public_id, answer_ids]) => ({
          question_public_id,
          answer_ids
        }))
      };
      await axiosInstance.post('/exams/attempts', payload);
      navigate(`/exams/${publicId}/result`);
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  if (!exam) return <Typography>Loading exam start...</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h3" gutterBottom>
        {exam.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Duration: {exam.duration} minutes
      </Typography>
      <Typography variant="body1" paragraph>
        {exam.description}
      </Typography>

      {exam.Questions.map((question, index) => (
        <Paper key={question.public_id} sx={{ p: 3, my: 3 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {question.content}
          </Typography>

          {question.thumbnail && (
            <Box my={2}>
              <img
                src={question.thumbnail}
                alt="Question illustration"
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </Box>
          )}

          {question.record && (
            <Box my={2}>
              <audio controls src={question.record} />
            </Box>
          )}

          <Chip label={question.type} color="info" variant="outlined" sx={{ mb: 2 }} />

          <List>
            {question.Answers.map((ans) => {
              const selected = !!answers[question.public_id]?.includes(ans.public_id);
              return (
                <ListItem key={ans.public_id} disablePadding>
                  <FormControlLabel
                    control={
                      question.type === 'multiple_choice' ? (
                        <Checkbox
                          checked={selected}
                          onChange={() =>
                            handleSelectAnswer(question.public_id, ans.public_id, 'multiple_choice')
                          }
                        />
                      ) : (
                        <Radio
                          checked={selected}
                          onChange={() =>
                            handleSelectAnswer(question.public_id, ans.public_id, 'single_choice')
                          }
                        />
                      )
                    }
                    label={ans.content}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      ))}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default ExamStartPage;
