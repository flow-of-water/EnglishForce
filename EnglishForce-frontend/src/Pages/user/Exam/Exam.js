import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

// Exam List
const ExamPage = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axiosInstance.get('/exams')
      .then(res => setExams(res.data))
      .catch(err => console.error('Failed to fetch exams', err));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Available Exams</Typography>
      <List>
        {exams.map((exam) => (
          <ListItem key={exam.public_id} button component={Link} to={`/exams/${exam.public_id}`}>
            <ListItemText primary={exam.name} secondary={exam.description} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExamPage;
