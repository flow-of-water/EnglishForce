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
  CircularProgress,
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const ExamAttemptAdmin = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await axiosInstance.get('/exam-attempts'); // API GET all exam attempts
      setAttempts(res.data);
    } catch (error) {
      console.error('Failed to fetch exam attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Exam Attempts</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Exam</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts.map((a, i) => (
                <TableRow key={a.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{a.User?.username || 'N/A'}</TableCell>
                  <TableCell>{a.Exam?.name || 'N/A'}</TableCell>
                  <TableCell>{a.score} / 100</TableCell>
                  <TableCell>{new Date(a.start).toLocaleString()}</TableCell>
                  <TableCell>{new Date(a.end).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {attempts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No attempts found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ExamAttemptAdmin;
