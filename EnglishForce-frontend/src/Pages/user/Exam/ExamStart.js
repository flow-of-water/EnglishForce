import isHtml from 'is-html';

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
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import ExamMenu from '../../../Components/user/ExamMenu';
import CircularLoading from '../../../Components/Loading';

const ExamStartPage = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
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


  // Warn users when they try to leave the page.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // cần thiết để Chrome hiển thị popup xác nhận
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  const handleSelectAnswer = (questionPublicId, answerPublicId, type) => {
    setAnswers((prev) => {
      if (type === 'multiple_choice') {
        const current = prev[questionPublicId] || [];
        return {
          ...prev,
          [questionPublicId]: current.includes(answerPublicId)
            ? current.filter((id) => id !== answerPublicId)
            : [...current, answerPublicId],
        };
      } else {
        return {
          ...prev,
          [questionPublicId]: [answerPublicId],
        };
      }
    });
  };
  // answers sẽ có dạng :
  // {
  //   'question-public-id-1': ['answer-id-1', 'answer-id-2'], // nếu multiple
  //   'question-public-id-2': ['answer-id-3']                 // nếu single
  // }


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        exam_public_id: publicId,
        answers: Object.entries(answers).map(([question_public_id, answer_ids]) => ({
          question_public_id,
          answer_ids
        }))
      };
      // console.log("payload : ",payload) ;
      const Response = await axiosInstance.post('/exams/attempts', payload);

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

      // console.log(selectedAnswerContents);
      navigate(`/exams/${publicId}/result/${Response.data.attemptPublicId}`, {
        state: { selectedAnswers: selectedAnswerContents }
      });
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return <CircularLoading />;

  let globalQuestionIndex = 1; // Biến toàn cục ngoài component hoặc ở đầu trong component nếu không tách file

  const renderPartRecursively = (part, indexPath = '') => (
    <Box key={part.public_id} mb={5}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Exam Part {indexPath}: {part.name}
      </Typography>

      {typeof part.description === 'string' && isHtml(part.description) ? <div dangerouslySetInnerHTML={{ __html: part.description }} />
        : <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {part.description}
        </Typography>
      }

      {part.thumbnail && (
        <Box my={2}>
          <Typography fontStyle="italic" color="text.secondary">Part Thumbnail:</Typography>
          <img src={part.thumbnail} alt="Part thumbnail" style={{ maxWidth: 600, borderRadius: '8px' }} />
        </Box>
      )}

      {part.record && (
        <Box my={2}>
          <Typography fontStyle="italic" color="text.secondary">Part Record:</Typography>
          <audio controls src={part.record} style={{ width: "100%" }} />
        </Box>
      )}

      {part.Questions?.map((question) => {
        const rendered = (
          <Paper key={question.public_id} sx={{ p: 3, my: 3 }} id={question.public_id} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Question {globalQuestionIndex}
            </Typography>
            <Typography variant="body1" gutterBottom>{question.content}</Typography>

            {question.thumbnail && (
              <Box my={2}>
                <img src={question.thumbnail} alt="Question illustration" style={{ maxWidth: '100%', borderRadius: '8px' }} />
              </Box>
            )}

            {question.record && (
              <Box my={2}>
                <audio controls src={question.record} />
              </Box>
            )}

            {question.type && <Chip label={question.type} color="info" variant="outlined" sx={{ mb: 2 }} />}

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
        );
        globalQuestionIndex++; // tăng sau mỗi question
        return rendered;
      })}

      {part.Children?.map((childPart, idx) =>
        renderPartRecursively(childPart, `${indexPath}.${idx + 1}`)
      )}
    </Box>
  );


  return (
    <Box p={4}>

      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      
      <ExamMenu
        parts={exam.parts}
        answers={answers}             // Object: { question_public_id: [answer_id1, answer_id2] }
        duration={exam?.duration}
        onSubmit={handleSubmit}
      />

      <Typography variant="h3" gutterBottom>
        {exam.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Duration: {exam.duration} minutes
      </Typography>
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
