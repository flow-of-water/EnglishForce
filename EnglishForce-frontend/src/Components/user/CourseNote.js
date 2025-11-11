import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axiosInstance from '../../Api/axiosInstance';
import { buttonStyle } from '../styles';

const CourseNote = ({ coursePublicId }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedTime, setSavedTime] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, success: true, message: '' });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axiosInstance.get(`/user-course/notes/${coursePublicId}`);
        setNote(res.data?.data?.notes || '');
      } catch (err) {
        console.error('❌ Get note failed:', err);
      } finally {
        setLoading(false);
      }
    };

    if (coursePublicId) fetchNote();
  }, [coursePublicId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/user-course/notes/${coursePublicId}`, { notes: note });
      setSnackbar({ open: true, success: true, message: '✅ Note saved successfully!' });
      setSavedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('❌ Save note failed:', err);
      setSnackbar({ open: true, success: false, message: '❌ Failed to save note.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      {/* Card-like note area */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#fafafa',
          boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
        }}
      >
        {loading ? (
          <LinearProgress color="primary" sx={{ borderRadius: 2 }} />
        ) : (
          <TextField
            placeholder="Write your personal notes for this course..."
            multiline
            rows={10}
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                fontSize: '1rem',
                lineHeight: 1.8,
                backgroundColor: '#fff',
                borderRadius: 2,
              },
            }}
          />
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="caption" color="text.secondary">
            {savedTime && (
              <>
                <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                Last saved at {savedTime}
              </>
            )}
          </Typography>

          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            disabled={saving || loading}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 3,
              textTransform: 'none',
              ...buttonStyle,
            }}
          >
            {saving ? 'Saving...' : 'Save Notes'}
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbar.success ? 'success' : 'error'}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseNote;
