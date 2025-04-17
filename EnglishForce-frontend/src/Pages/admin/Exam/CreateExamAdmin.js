import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Paper,
  Alert
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ExamAdminCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !duration) {
      setError('Name and Duration are required.');
      return;
    }

    try {
      const res = await axiosInstance.post('/exams', {
        name,
        description,
        duration: parseInt(duration, 10)
      });

      setSuccess('Exam created successfully!');
      setTimeout(() => {
        navigate(`/admin/exams/${res.data.public_id}`);
      }, 1500);
    } catch (err) {
      console.error('Create exam error:', err);
      setError('Failed to create exam.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Exam
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Exam Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
            <Box textAlign="right">
              <Button type="submit" variant="contained">
                Create Exam
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ExamAdminCreate;
