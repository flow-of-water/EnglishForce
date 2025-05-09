import React, { useState, useEffect } from 'react';
import { Box, Typography, List, Button, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { green, grey } from '@mui/material/colors';


const ExamMenu = ({ parts, answers, duration, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);


  useEffect(() => {
    if (duration) {
      const startTime = new Date(); // Luôn tạo mới

      const endTime = new Date(startTime.getTime() + duration * 60000);

      const updateRemainingTime = () => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) onSubmit();
      };

      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [duration]);


  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleNavigateToQuestion = (questionId) => {
    const element = document.getElementById(`${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 🧠 Global index counter
  let globalQuestionIndex = 1;

  const renderPartsAndQuestions = (parts) => {
    return parts.map((part) => (
      <Box key={part.public_id} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          📚 {part.name}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {part.Questions?.map((question) => {
            const isAnswered = answers[question.public_id] !== undefined;
            const questionNumber = globalQuestionIndex++; // Tăng liên tục không reset

            return (
              <Box
                key={question.public_id}
                onClick={() => {
                  handleNavigateToQuestion(question.public_id);
                  setOpen(false);
                }}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: isAnswered ? green[700] : grey[300],
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: isAnswered ? green[900] : grey[400],
                  }
                }}
              >
                {questionNumber}
              </Box>
            );
          })}
        </Box>

        {part.Children?.length > 0 && (
          <Box sx={{ pl: 2 }}>
            {renderPartsAndQuestions(part.Children)}
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <>
      {!open && (
        <Box
          sx={{
            position: 'fixed',
            top: 60,
            right: 16,
            zIndex: 1300,
            bgcolor: grey[200],
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            height: 56,
            boxShadow: 3,
            '&:hover': {
              bgcolor: grey[300],
            },
            caretColor: "transparent",
          }}
        >
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{
              color: 'inherit',
            }}
          >
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>
            {formatTimeLeft(timeLeft)}
          </Typography>
        </Box>
      )}


      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 300,
            height: '100vh',
            bgcolor: grey[100],
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">⏳ Time Left</Typography>
            <Typography variant="h4" color={timeLeft <= 60 ? 'error.main' : 'text.primary'}>
              {formatTimeLeft(timeLeft)}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              📝 Questions
            </Typography>
            {renderPartsAndQuestions(parts)}
          </Box>

          <Button
            variant="contained"
            onClick={onSubmit}
            fullWidth
            size="large"
          >
            Submit Exam
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default ExamMenu;
