import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axiosInstance from '../../../Api/axiosInstance';

const DetailBlogAdmin = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlogDetail();
  }, [publicId]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/blogs/${publicId}`);
      setBlog(response.data.blog || response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/blogs/${publicId}/edit`);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await axiosInstance.delete(`/blogs/${publicId}`);
      navigate('/admin/blogs', { 
        state: { message: 'Blog deleted successfully' } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/admin/blogs')}
          sx={{ mt: 2 }}
        >
          Back to Blogs
        </Button>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box p={3}>
        <Alert severity="warning">Blog not found</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/admin/blogs')}
          sx={{ mt: 2 }}
        >
          Back to Blogs
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/admin/blogs')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Blog Details
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            color="primary"
          >
            Edit Blog
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            color="error"
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Blog Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {/* Thumbnail */}
            {blog.thumbnail && (
              <CardMedia
                component="img"
                height="400"
                image={blog.thumbnail}
                alt={blog.name}
                sx={{ borderRadius: 2, mb: 3, objectFit: 'cover' }}
              />
            )}

            {/* Title */}
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {blog.name}
            </Typography>

            {/* Slug */}
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Slug: <strong>{blog.slug}</strong>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            {blog.description && (
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {blog.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Content */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Content
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8
                }}
              >
                {blog.content || 'No content available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Metadata */}
        <Grid item xs={12} md={4}>
          {/* Author Info */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Author Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar 
                  src={blog.User?.avatar} 
                  alt={blog.User?.username}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {blog.User?.username || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {blog.User?.email || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Categories
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" flexWrap="wrap" gap={1}>
                {blog.BlogCategories && blog.BlogCategories.length > 0 ? (
                  blog.BlogCategories.map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No categories assigned
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Timestamps
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Created:</strong>
                </Typography>
                <Typography variant="body1" mb={2}>
                  {formatDate(blog.created_at)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Last Updated:</strong>
                </Typography>
                <Typography variant="body1">
                  {formatDate(blog.updated_at)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Technical Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Public ID: <strong>{blog.public_id}</strong>
                </Typography>
                {blog.thumbnail_public_id && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Cloudinary ID: <strong>{blog.thumbnail_public_id}</strong>
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DetailBlogAdmin;