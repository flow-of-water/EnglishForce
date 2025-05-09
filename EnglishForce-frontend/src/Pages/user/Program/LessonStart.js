import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box, Typography, Card, CardContent, RadioGroup, FormControlLabel,
  Radio, CircularProgress, Divider, Avatar, Button, Alert
} from '@mui/material';

const LessonStartPage = () => {
  const { lessonPublicId , unitPublicId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const fetchLessonDetail = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/${lessonPublicId}`);
      setLesson(res.data);
      setExercises(res.data.Exercises || []);
    } catch (error) {
      console.error('❌ Failed to fetch lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetail();
  }, [lessonPublicId]);

  const currentExercise = exercises[currentIndex];

  const handleCheckAnswer = () => {
    if (!selectedAnswerId) return;
    const answer = currentExercise.ExerciseAnswers.find(a => a.id === selectedAnswerId);
    if (!answer) return;
    setIsCorrect(answer.is_correct);
    setShowResult(true);
    if (answer.is_correct) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    const isLast = currentIndex === exercises.length - 1;
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswerId(null);
      setShowResult(false);
      setIsCorrect(null);
    }
  };

  const handleBackToLesson = () => {
    // navigate(`/programs/${lesson?.Unit?.program_id}/units/${lesson?.unit_id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson || exercises.length === 0) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        No exercises found for this lesson.
      </Typography>
    );
  }

  if (finished) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>🎉 Lesson Completed!</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          You answered <b>{score}</b> out of <b>{exercises.length}</b> questions correctly.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleBackToLesson}
        >
          Back to Unit
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{lesson.name}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{lesson.description}</Typography>

      <Divider sx={{ my: 3 }} />

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Question {currentIndex + 1}: {currentExercise.question}
          </Typography>

          {currentExercise.thumbnail && (
            <Avatar
              variant="rounded"
              src={currentExercise.thumbnail}
              alt="thumbnail"
              sx={{ width: 120, height: 120, my: 2 }}
            />
          )}

          {currentExercise.record && (
            <audio controls style={{ marginBottom: '1rem' }}>
              <source src={currentExercise.record} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {currentExercise.type === 'single_choice' && (
            <RadioGroup
              value={selectedAnswerId}
              onChange={(e) => setSelectedAnswerId(parseInt(e.target.value))}
            >
              {currentExercise.ExerciseAnswers.map((ans) => (
                <FormControlLabel
                  key={ans.id}
                  value={ans.id}
                  control={<Radio />}
                  label={ans.content}
                  disabled={showResult}
                />
              ))}
            </RadioGroup>
          )}

          {showResult && (
            <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
            </Alert>
          )}

          {!showResult ? (
            <Button
              variant="contained"
              onClick={handleCheckAnswer}
              sx={{ mt: 2 }}
              disabled={selectedAnswerId === null}
            >
              OK
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleNext}
              sx={{ mt: 2 }}
            >
              {currentIndex === exercises.length - 1 ? 'End Lesson' : 'Next'}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LessonStartPage;
