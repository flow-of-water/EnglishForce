import React, { useState } from 'react';
import {
  Box,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import axiosInstance from './../../../Api/axiosInstance';

const UpdateAvatar = ({ currentAvatar, onAvatarUpdated }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    setSuccess('');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await axiosInstance.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Avatar updated successfully!');
      
      if (onAvatarUpdated) onAvatarUpdated(response.data.avatar);
      
      setTimeout(() => handleClose(), 1500);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error.response?.data?.error || 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        color="primary"
        aria-label="upload picture"
        onClick={handleOpen}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'primary.light' },
        }}
      >
        <PhotoCamera />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Avatar
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={previewUrl || currentAvatar}
              sx={{ width: 250, height: 250 }}
            />

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload-input"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="avatar-upload-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={loading}
              >
                Select Image
              </Button>
            </label>

            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateAvatar;