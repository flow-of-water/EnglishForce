import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const ExamDetail = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/exams/${publicId}`)
      .then(res => setExam(res.data))
      .catch(err => console.error('Failed to fetch exam details', err));
  }, [publicId]);

  if (!exam) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4">{exam.name}</Typography>
      <Typography>{exam.description}</Typography>

      {exam.Questions.map((q, index) => (
        <Box key={q.public_id} mt={3}>
          <Typography variant="h6">Question {index + 1}</Typography>
          <Typography>{q.content}</Typography>
          <List>
            {q.Answers.map(ans => (
              <ListItem key={ans.public_id}>
                <ListItemText primary={ans.content} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default ExamDetail;
