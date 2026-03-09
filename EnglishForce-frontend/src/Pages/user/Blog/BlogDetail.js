import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Chip,
    Avatar,
    Stack,
    Divider,
    CircularProgress,
    Paper,
    Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
import axiosInstance from '../../../Api/axiosInstance';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogDetail();
    }, [slug]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/blogs/slug/${slug}`);
            setBlog(response.data.blog);
        } catch (error) {
            console.error('Fetch blog detail error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEdit = () => {
        navigate(`/blogs/${slug}/edit`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!blog) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h4">Blog not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Back Button and Edit Button */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/blogs')}
                >
                    <ArrowBackIcon />
                    <Typography>Back to Blog</Typography>
                </Box>

                {blog.is_owned && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                        >
                            Edit Blog
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this blog?')) {
                                    axiosInstance.delete(`/blogs/${blog.public_id}`)
                                        .then(() => {
                                            navigate('/blogs');
                                        })
                                        .catch((error) => {
                                            console.error('Delete blog error:', error);
                                            alert('Failed to delete the blog. Please try again.');
                                        });
                                }
                            }}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                        >
                            Delete Blog
                        </Button>
                    </div>
                )}
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 } }}>
                {/* Categories */}
                <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
                    {blog.BlogCategories?.map((cat) => (
                        <Chip
                            key={cat.public_id}
                            label={cat.name}
                            variant="outlined"
                            sx={{ backgroundColor: cat.color }}
                        />
                    ))}
                </Stack>

                {/* Title */}
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {blog.title}
                </Typography>

                {/* Meta Info */}
                <Box display="flex" alignItems="center" gap={3} mb={3} flexWrap="wrap">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                            src={blog.User?.avatar}
                            alt={blog.User?.username}
                            sx={{ width: 40, height: 40 }}
                        />
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {blog.User?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Author
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(blog.created_at)}
                        </Typography>
                    </Box>

                    {blog.view_count > 0 && (
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {blog.view_count} views
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Thumbnail */}
                {blog.thumbnail && (
                    <Box
                        component="img"
                        src={blog.thumbnail}
                        alt={blog.title}
                        sx={{
                            width: '100%',
                            maxHeight: 500,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mb: 4
                        }}
                    />
                )}

                {/* Description */}
                {blog.description && (
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 4, fontStyle: 'italic' }}
                    >
                        {blog.description}
                    </Typography>
                )}

                {/* Content */}
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.8,
                        '& p': { mb: 2 },
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </Typography>
            </Paper>
        </Container>
    );
};

export default BlogDetail;