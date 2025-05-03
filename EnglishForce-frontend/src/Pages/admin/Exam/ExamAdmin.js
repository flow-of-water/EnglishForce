import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Button,
  Stack,
  Pagination
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axiosInstance from '../../../Api/axiosInstance';
import { Link } from "react-router-dom";

const ExamAdmin = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchExams(page);
  }, [page]);

  const fetchExams = async (page) => {
    try {
      const res = await axiosInstance.get(`/exams?page=${page}`);
      setExams(res.data.exams);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    }
  };

  const handleDelete = async (publicId) => {
    try {
      await axiosInstance.delete(`/exams/${publicId}`);
      setExams(prev => prev.filter((exam) => exam.public_id !== publicId));
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Exam Management</Typography>
        <Button variant="contained" startIcon={<Add />} href="/admin/exams/create">
          Create Exam
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.public_id}>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{exam.description}</TableCell>
                <TableCell>{exam.duration}</TableCell>
                <TableCell align="right">
                  <Button color="primary" component={Link} to={`/admin/exams/${exam.public_id}`}>Detail</Button>
                  <Button color="error" onClick={() => handleDelete(exam.public_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {exams.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No exams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Stack alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </Container>
  );
};

export default ExamAdmin;
