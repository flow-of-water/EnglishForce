import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Paper, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
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
      setMessage('Error changing password');
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
          sx={{mt:1}}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{mt:1}}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{mt:1}}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{mt:1}}>
          {loading ? 'Processing...' : 'Change Password'}
        </Button>
      </form>
      {message && <Typography variant="body1">{message}</Typography>}
    </div>
  );
};



const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // For controlling Dialog visibility

  useEffect(() => {
    async function Fetch() {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance(`/users/profile/${userId}`);
      setUser(response.data);
      setLoading(false);
    }
    Fetch();
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      {user ? (
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>Profile</Typography>
          <Typography variant="h6">Username: {user.username}</Typography>
          <Typography variant="h6">Role: {user.role}</Typography>

          <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{mt:3}}>
            Change Password
          </Button>

          {/* Dialog for Change Password */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <ChangePassword />
            </DialogContent>
          </Dialog>
        </Paper>
      ) : (
        <Typography variant="h6">No user data available</Typography>
      )}
    </Container>
  );
};

export default Profile;
