import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  Pagination
} from '@mui/material';

// Exam List
const ExamPage = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExams = async (page) => {
    try {
      const res = await axiosInstance.get(`/exams?page=${page}`);
      setExams(res.data.exams);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  useEffect(() => {
    fetchExams(page);
  }, [page]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Available Exams</Typography>
      <List>
        {exams.map((exam) => (
          <ListItem key={exam.public_id} button component={Link} to={`/exams/${exam.public_id}`}>
            <ListItemText primary={exam.name} secondary={exam.description} />
          </ListItem>
        ))}
        {exams.length === 0 && (
          <ListItem>
            <ListItemText primary="No exams available." />
          </ListItem>
        )}
      </List>

      {/* Pagination */}
      <Stack alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default ExamPage;
