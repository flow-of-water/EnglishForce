import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Chip,
    Autocomplete,
    IconButton,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0); // 0: Edit, 1: Preview
    const [categories, setCategories] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        content: '',
        slug: '',
        thumbnail: '',
        categories: []
    });

    useEffect(()=> {
        const fetchCategory = async () => {
            const result = await axiosInstance.get('/blog-categories') ;
            setCategories(result.data.categories) ;
        }
        fetchCategory() ;
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Auto-generate slug from name
        if (field === 'name') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.content || !formData.slug) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/blogs', {
                name: formData.name,
                description: formData.description,
                content: formData.content,
                slug: formData.slug,
                thumbnail: formData.thumbnail,
                category_ids: formData.categories.map(cat => cat.id)
            });

            setSuccess('Blog created successfully!');
            setTimeout(() => {
                navigate('/blogs');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate('/blogs')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">
                    Create New Blog
                </Typography>
            </Box>

            {/* Alerts */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Left Column - Form Fields */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Blog Details
                            </Typography>

                            <TextField
                                fullWidth
                                label="Title"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Slug (URL)"
                                required
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                helperText="Auto-generated from title"
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Thumbnail URL"
                                value={formData.thumbnail}
                                onChange={(e) => handleChange('thumbnail', e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <Autocomplete
                                multiple
                                options={categories}
                                getOptionLabel={(option) => option.name}
                                value={formData.categories}
                                onChange={(e, newValue) => handleChange('categories', newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Categories" />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name}
                                            {...getTagProps({ index })}
                                            sx={{backgroundColor: option.color}}
                                        />
                                    ))
                                }
                                sx={{ mb: 2 }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                startIcon={<SaveIcon />}
                            >
                                {loading ? 'Creating...' : 'Create Blog'}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Right Column - Markdown Editor/Preview */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            {/* Tabs for Edit/Preview */}
                            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                                <Tab label="Edit Markdown" />
                                <Tab label="Preview" icon={<PreviewIcon />} iconPosition="start" />
                            </Tabs>

                            {/* Edit Tab */}
                            {tabValue === 0 && (
                                <>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Write your blog content in Markdown format
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={20}
                                        required
                                        placeholder="# Your Blog Title

Write your content here using **Markdown** syntax...

## Section 1
- Bullet point 1
- Bullet point 2

## Section 2
```javascript
// Code example
console.log('Hello World');
```

[Link text](https://example.com)"
                                        value={formData.content}
                                        onChange={(e) => handleChange('content', e.target.value)}
                                        sx={{
                                            '& textarea': {
                                                fontFamily: 'monospace',
                                                fontSize: '14px'
                                            }
                                        }}
                                    />
                                </>
                            )}

                            {/* Preview Tab */}
                            {tabValue === 1 && (
                                <Box
                                    sx={{
                                        minHeight: 400,
                                        p: 3,
                                        bgcolor: 'background.default',
                                        borderRadius: 1,
                                        '& img': { maxWidth: '100%' },
                                        '& pre': { 
                                            bgcolor: '#1e1e1e',
                                            p: 2,
                                            borderRadius: 1,
                                            overflow: 'auto'
                                        }
                                    }}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        }}
                                    >
                                        {formData.content || '*No content yet. Start writing in the Edit tab.*'}
                                    </ReactMarkdown>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CreateBlog;