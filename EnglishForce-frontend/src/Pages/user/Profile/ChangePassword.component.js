import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance'; 

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/auth/change-password`, {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error when changing password. Current password is incorrect.');
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 1 }}>
          {loading ? 'Processing...' : 'Change Password'}
        </Button>
      </form>
      {message && <Typography variant="body1">{message}</Typography>}
    </div>
  );
};

export default ChangePassword;
