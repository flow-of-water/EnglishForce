import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Box,
    Pagination,
    CircularProgress,
    Avatar,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BlogPage = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        fetchBlogs(pagination.page);
    }, [pagination.page]);

    const fetchBlogs = async (page) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, {
                params: { page, limit: 9 }
            });
            
            if (response.data.success) {
                setBlogs(response.data.data.blogs);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error('Fetch blogs error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlogClick = (slug) => {
        navigate(`/blog/${slug}`);
    };

    const handlePageChange = (event, value) => {
        setPagination(prev => ({ ...prev, page: value }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box mb={6} textAlign="center">
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Blog
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Learn English tips, strategies, and more
                </Typography>
            </Box>

            {/* Blog Grid */}
            <Grid container spacing={4}>
                {blogs.map((blog) => (
                    <Grid item xs={12} sm={6} md={4} key={blog.public_id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6
                                }
                            }}
                            onClick={() => handleBlogClick(blog.slug)}
                        >
                            {/* Thumbnail */}
                            <CardMedia
                                component="img"
                                height="200"
                                image={blog.thumbnail || 'https://via.placeholder.com/400x200?text=Blog+Thumbnail'}
                                alt={blog.title}
                            />

                            <CardContent sx={{ flexGrow: 1 }}>
                                {/* Categories */}
                                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
                                    {blog.BlogCategories?.map((cat) => (
                                        <Chip
                                            key={cat.public_id}
                                            label={cat.name}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>

                                {/* Title */}
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {blog.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        mb: 2
                                    }}
                                >
                                    {blog.description}
                                </Typography>

                                {/* Author & Meta */}
                                <Box display="flex" alignItems="center" justifyContent="space-between" mt="auto">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar
                                            src={blog.Author?.avatar}
                                            alt={blog.Author?.username}
                                            sx={{ width: 28, height: 28 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {blog.Author?.username}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(blog.published_at)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* View Count */}
                                {blog.view_count > 0 && (
                                    <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                        <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {blog.view_count} views
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={6}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Container>
    );
};

export default BlogPage;