import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
} from '@mui/material';
import axiosInstance from '../../Api/axiosInstance';
import SpeakingExercise from './SpeakingExercise';

const ExerciseCard = ({
  exercise,
  index,
  onAnswerChecked,
  handleNext,
  isLast,
}) => {
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  // useState for speaking and Writing exercise
  const [userText, setUserText] = useState('');
  const [speakingResult, setSpeakingResult] = useState(null);

  useEffect(() => {
    setSelectedAnswerId(null);
    setUserText('');
    setSpeakingResult(null);
    setIsCorrect(null);
    setShowResult(false);
  }, [exercise]);


  const handleCheckAnswer = async () => {
    if (!exercise) return;

    if (exercise.type === 'single_choice') {
      if (!selectedAnswerId) return;
      const answer = exercise.ExerciseAnswers.find(a => a.id === selectedAnswerId);
      if (!answer) return;
      setIsCorrect(answer.is_correct);
      setShowResult(true);
      if (answer.is_correct) onAnswerChecked(answer.is_correct);
      return;
    }

    else if (exercise.type === 'writing') {
      if (!userText.trim()) return;
      try {
        const res = await axiosInstance.post('/AI/check-writing', {
          question: exercise.question,
          userAnswer: userText
        });

        const isCorrect = res.data === 1; // hoặc res.data.isCorrect nếu bạn trả về JSON
        setIsCorrect(isCorrect);
        setShowResult(true);
        if (isCorrect) onAnswerChecked(isCorrect);
      } catch (error) {
        console.error("Gemini API error:", error);
        alert("An error occurred while grading. Please try again.");
      }

      return;
    }

    else if (exercise.type === 'speaking') {
      if (!speakingResult) return;
      setIsCorrect(speakingResult.isCorrect);
      setShowResult(true);
      if (speakingResult.isCorrect) onAnswerChecked(speakingResult.isCorrect);
      return;
    }
  };

  const renderAnswerSection = () => {
    switch (exercise.type) {
      case 'single_choice':
        return (
          <RadioGroup
            value={selectedAnswerId}
            onChange={(e) => setSelectedAnswerId(parseInt(e.target.value))}
          >
            {exercise.ExerciseAnswers.map((ans) => (
              <FormControlLabel
                key={ans.id}
                value={ans.id}
                control={<Radio />}
                label={ans.content}
                disabled={showResult}
              />
            ))}
          </RadioGroup>
        );
      case 'writing':
        return (
          <TextField
            label="Your Answer"
            fullWidth
            multiline
            minRows={4}
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            disabled={showResult}
          />
        );
      case 'speaking':
        return (
          <SpeakingExercise
            expectedText={exercise.question}
            onResult={setSpeakingResult}
          />
        );
      default:
        return <Typography color="error">Unsupported exercise type.</Typography>;
    }
  };



  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
          Question {index + 1}: {exercise.question}
        </Typography>

        {exercise.thumbnail && (
          <Avatar
            variant="rounded"
            src={exercise.thumbnail}
            alt="thumbnail"
            sx={{ width: 120, height: 120, my: 2 }}
          />
        )}

        {exercise.record && (
          <Button
            variant="outlined"
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(exercise.record);
              utterance.volume = 1; // Tăng âm lượng lên mức tối đa (1 là max)
              speechSynthesis.speak(utterance);
            }}
            sx={{ mb: 2, display: 'block', }}
          >
            🔊 Read Aloud
          </Button>
        )}

        <Chip
          label={exercise.type.replace('_', ' ').toUpperCase()}
          color="primary"
          size="small"
          sx={{ mb: 2 }}
        />

        {renderAnswerSection()}

        {showResult && (
          <>
            {exercise.type != 'speaking' &&<Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
            </Alert>}
            {exercise.explanation && (
              <Alert severity="info" sx={{ mt: 2 }}>
                📘 Explanation: {exercise.explanation}
              </Alert>
            )}
          </>
        )}

        {!showResult ? (
          <Button
            variant="contained"
            onClick={handleCheckAnswer}
            sx={{ mt: 2 }}
            disabled={
              exercise.type === 'single_choice' ? selectedAnswerId === null :
                exercise.type === 'writing' ? userText.trim() === '' :
                  exercise.type === 'speaking' ? speakingResult === null :
                    false
            }
          >
            OK
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleNext} sx={{ mt: 2 }}>
            {isLast ? 'End Lesson' : 'Next'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
