import React, { useState } from 'react';
import {
  Box, Container, Button, TextField, Typography, Stack, InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';

const ProgramCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order_index: 0,
    thumbnail: null
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      thumbnail: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('order_index', formData.order_index);
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      await axiosInstance.post('/programs', data);
      navigate('/admin/programs');
    } catch (err) {
      console.error('Failed to create program:', err);
    }
  };

  return (
    <Container p={3}>
      <Typography variant="h4" gutterBottom>Create New Program</Typography>
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack spacing={3}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            label="Order Index"
            name="order_index"
            type="number"
            value={formData.order_index}
            onChange={handleChange}
          />
          <Box>
            <InputLabel>Thumbnail</InputLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Box>
          <Button type="submit" variant="contained">Create Program</Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ProgramCreate;
