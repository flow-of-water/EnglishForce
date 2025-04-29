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
import ExamMenu from '../../../Components/user/ExamMenu';

const ExamStartPage = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axiosInstance.get(`/exams/${publicId}`);
        setExam(response.data);
      } catch (err) {
        console.error('Failed to fetch exam details', err);
      }
    };
    fetchExam();
  }, [publicId]);

  useEffect(() => {
    if (exam?.duration) {
      const existingStart = localStorage.getItem(`exam_${publicId}_start`);
      let startTime;

      if (existingStart) {
        startTime = new Date(existingStart);
      } else {
        startTime = new Date();
        localStorage.setItem(`exam_${publicId}_start`, startTime.toISOString());
      }

      const endTime = new Date(startTime.getTime() + exam.duration * 60000);

      const updateRemainingTime = () => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) handleSubmit();
      };

      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [exam]);

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
      localStorage.removeItem(`exam_${publicId}_start`);

      const payload = {
        exam_public_id: publicId,
        answers: Object.entries(answers).map(([question_public_id, answer_ids]) => ({
          question_public_id,
          answer_ids
        }))
      };
      await axiosInstance.post('/exams/attempts', payload);

      // Build selected answer content
      const selectedAnswerContents = [];

      const extractQuestions = (part) => {
        part.Questions?.forEach((question) => {
          const selected = question.Answers.filter((a) =>
            answers[question.public_id]?.includes(a.public_id)
          );
          selectedAnswerContents.push({
            question_public_id: question.public_id,
            question_content: question.content,
            selected_answers: selected.map((a) => a.content)
          });
        });

        part.Children?.forEach((childPart) => {
          extractQuestions(childPart); // Đệ quy
        });
      };

      exam.parts.forEach((part) => {
        extractQuestions(part);
      });

      console.log(selectedAnswerContents);
      navigate(`/exams/${publicId}/result`, {
        state: { selectedAnswers: selectedAnswerContents }
      });
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  if (!exam) return <Typography>Loading exam start...</Typography>;

  const renderPartRecursively = (part, indexPath = '') => (
    <Box key={part.public_id} mb={5}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Part {indexPath}: {part.name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {part.description}
      </Typography>

      {/* Hiển thị Thumbnail và Record của Part */}
      {part.thumbnail && (
        <Box my={2}>
          <Typography fontStyle="italic" color="text.secondary">
            Part Thumbnail:
          </Typography>
          <img
            src={part.thumbnail}
            alt="Part thumbnail"
            style={{
              maxWidth: 600, height: 'auto', display: 'block',
              borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </Box>
      )}

      {part.record && (
        <Box my={2}>
          <Typography fontStyle="italic" color="text.secondary">
            Part Record:
          </Typography>
          <audio controls src={part.record} style={{ width: "100%" }} />
        </Box>
      )}

      {/* Danh sách Question */}
      {part.Questions?.map((question, index) => (
        <Paper key={question.public_id} sx={{ p: 3, my: 3 }} id={question.public_id} elevation={3}>
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
            {question.Answers?.map((ans) => {
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

      {/* Render Children nếu có */}
      {part.Children?.map((childPart, idx) =>
        renderPartRecursively(childPart, `${indexPath}.${idx + 1}`)
      )}
    </Box>
  );

  return (
    <Box p={4}>
      <ExamMenu
        parts={exam.parts}
        answers={answers}             // Object: { question_public_id: [answer_id1, answer_id2] }
        timeLeft={timeLeft}
        onSubmit={handleSubmit}
      />

      <Typography variant="h3" gutterBottom>
        {exam.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Duration: {exam.duration} minutes
      </Typography>
      {timeLeft !== null && (
        <Typography variant="subtitle1" color="error" gutterBottom>
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Typography>
      )}
      <Typography variant="body1" paragraph>
        {exam.description}
      </Typography>

      {exam.parts.map((part, index) =>
        renderPartRecursively(part, `${index + 1}`)
      )}

    </Box>
  );
};

export default ExamStartPage;
