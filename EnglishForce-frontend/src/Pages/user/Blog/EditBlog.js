import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    IconButton,
    Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from '../../../Api/axiosInstance';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const EditBlogPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Blog data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        content: '',
        slug: '',
        thumbnail: null,
        selectedCategories: []
    });

    // Categories data
    const [allCategories, setAllCategories] = useState([]);
    
    // Image preview
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [currentThumbnail, setCurrentThumbnail] = useState(null);

    useEffect(() => {
        fetchBlogAndCategories();
    }, [slug]);

    const fetchBlogAndCategories = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch blog details
            const blogResponse = await axiosInstance.get(`/blogs/slug/${slug}`);
            const blog = blogResponse.data.blog;

            // Check if user owns this blog
            if (!blog?.is_owned) {
                setError('You do not have permission to edit this blog');
                setTimeout(() => navigate(`/blogs/${slug}`), 2000);
                return;
            }

            // Fetch all categories
            const categoriesResponse = await axiosInstance.get('/blog-categories');
            setAllCategories(categoriesResponse.data.categories || []);

            // Set form data
            setFormData({
                name: blog.name || '',
                description: blog.description || '',
                content: blog.content || '',
                slug: blog.slug || '',
                thumbnail: null,
                selectedCategories: blog.BlogCategories?.map(cat => cat.public_id) || []
            });

            setCurrentThumbnail(blog.thumbnail);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.response?.data?.message || 'Failed to load blog data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        setFormData(prev => ({
            ...prev,
            selectedCategories: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            setFormData(prev => ({ ...prev, thumbnail: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        if (!formData.content.trim()) {
            setError('Content is required');
            return;
        }

        try {
            setSubmitting(true);

            // Create FormData for multipart/form-data
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('content', formData.content);
            submitData.append('slug', formData.slug);
            
            // Add categories
            formData.selectedCategories.forEach(categoryId => {
                submitData.append('categories[]', categoryId);
            });

            // Add thumbnail if new one is selected
            if (formData.thumbnail) {
                submitData.append('thumbnail', formData.thumbnail);
            }

            const response = await axiosInstance.put(`/blogs/slug/${slug}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Blog updated successfully!');
            
            // Navigate to blog detail after 1.5 seconds
            setTimeout(() => {
                navigate(`/blogs/${response.data.blog.slug}`);
            }, 1500);

        } catch (error) {
            console.error('Submit error:', error);
            setError(error.response?.data?.message || 'Failed to update blog');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Header */}
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={4}
                sx={{ cursor: 'pointer', width: 'fit-content' }}
                onClick={() => navigate(`/blogs/${slug}`)}
            >
                <ArrowBackIcon />
                <Typography>Back to Blog</Typography>
            </Box>

            <Paper elevation={3} sx={{ p: { xs: 3, md: 6 } }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Edit Blog
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        placeholder="Enter blog name"
                    />

                    {/* Slug */}
                    <TextField
                        fullWidth
                        label="Slug (URL)"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        placeholder="blog-url-slug"
                        helperText="URL-friendly version of the name"
                    />

                    {/* Description */}
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={2}
                        placeholder="Brief description of your blog"
                    />

                    {/* Categories */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Categories</InputLabel>
                        <Select
                            multiple
                            value={formData.selectedCategories}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput label="Categories" />}
                            renderValue={(selected) => (
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {selected.map((value) => {
                                        const category = allCategories.find(cat => cat.public_id === value);
                                        return (
                                            <Chip 
                                                key={value} 
                                                label={category?.name || value}
                                                size="small"
                                            />
                                        );
                                    })}
                                </Stack>
                            )}
                            MenuProps={MenuProps}
                        >
                            {allCategories.map((category) => (
                                <MenuItem key={category.public_id} value={category.public_id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Thumbnail Upload */}
                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Thumbnail Image
                        </Typography>

                        {/* Current or Preview Image */}
                        {(thumbnailPreview || currentThumbnail) && (
                            <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                                <Box
                                    component="img"
                                    src={thumbnailPreview || currentThumbnail}
                                    alt="Thumbnail preview"
                                    sx={{
                                        width: '100%',
                                        maxWidth: 400,
                                        height: 200,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        border: '2px solid',
                                        borderColor: 'divider'
                                    }}
                                />
                                {thumbnailPreview && (
                                    <IconButton
                                        onClick={handleRemoveImage}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'background.paper',
                                            '&:hover': { bgcolor: 'error.light' }
                                        }}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        )}

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            {thumbnailPreview ? 'Change Image' : 'Upload Image'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                            Max size: 5MB. Recommended: 1200x600px
                        </Typography>
                    </Box>

                    {/* Content */}
                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        multiline
                        rows={15}
                        placeholder="Write your blog content here (Markdown supported)"
                        helperText="You can use Markdown syntax for formatting"
                    />

                    {/* Action Buttons */}
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2} 
                        sx={{ mt: 4 }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<SaveIcon />}
                            disabled={submitting}
                            sx={{ flex: 1 }}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate(`/blogs/${slug}`)}
                            disabled={submitting}
                            sx={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditBlogPage;