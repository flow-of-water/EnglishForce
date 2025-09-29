import { useState, useEffect } from 'react';
import { TextField, Box, Typography, Button, Stack } from '@mui/material';
import axiosInstance from '../../Api/axiosInstance';

const CourseNote = ({ coursePublicId }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


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
      await axiosInstance.put(`/user-course/notes/${coursePublicId}`, {
        notes: note,
      });
      alert('✅ The note has been saved!');
    } catch (err) {
      alert('❌ Save note failed!');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        📝 Ghi chú của bạn
      </Typography>
      <TextField
        placeholder="Note here..."
        multiline
        rows={10}
        fullWidth
        value={note}
        onChange={(e) => setNote(e.target.value)}
        variant="outlined"
        sx={{
          fontSize: '1.2rem',
          backgroundColor: '#f9f9f9',
        }}
        disabled={loading}
      />
      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving || loading}
        >
          {saving ? 'Saving...' : '💾 Save notes'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CourseNote;
