import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	OutlinedInput,
	CircularProgress,
	Alert,
	Grid,
	IconButton,
	Card,
	CardMedia,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Save as SaveIcon,
	Delete as DeleteIcon,
	Image as ImageIcon,
} from '@mui/icons-material';
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

const EditBlogAdmin = () => {
	const { publicId } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	// Blog data
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		content: '',
		slug: '',
		thumbnail: '',
	});

	// Categories
	const [categories, setCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);

	// Image handling
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [existingThumbnail, setExistingThumbnail] = useState(null);

	useEffect(() => {
		fetchBlogData();
		fetchCategories();
	}, [publicId]);

	const fetchBlogData = async () => {
		try {
			setLoading(true);
			const response = await axiosInstance.get(`/blogs/${publicId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			const blog = response.data.blog;
			setFormData({
				name: blog.name || '',
				description: blog.description || '',
				content: blog.content || '',
				slug: blog.slug || '',
				thumbnail: blog.thumbnail || '',
			});

			setExistingThumbnail(blog.thumbnail);

			// Set selected categories
			if (blog.BlogCategories) {
				setSelectedCategories(blog.BlogCategories.map(cat => cat.public_id));
			}

			setError(null);
		} catch (err) {
			console.error('Error fetching blog:', err);
			setError(err.response?.data?.message || 'Failed to load blog data');
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axiosInstance.get('/blog-categories', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setCategories(response.data.categories || []);
		} catch (err) {
			console.error('Error fetching categories:', err);
		}
	};

	const generateSlug = text => {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));

		// Auto-generate slug from name
		if (name === 'name') {
			setFormData(prev => ({
				...prev,
				slug: generateSlug(value),
			}));
		}
	};

	const handleCategoryChange = event => {
		const {
			target: { value },
		} = event;
		setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
	};

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setError('Image size should be less than 5MB');
				return;
			}

			if (!file.type.startsWith('image/')) {
				setError('Please select a valid image file');
				return;
			}

			setImageFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
			setError(null);
		}
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		// Validation
		if (!formData.name.trim()) {
			setError('Blog name is required');
			return;
		}
		if (!formData.slug.trim()) {
			setError('Slug is required');
			return;
		}
		if (!formData.content.trim()) {
			setError('Content is required');
			return;
		}

		try {
			setSubmitting(true);
			setError(null);

			const submitData = new FormData();
			submitData.append('name', formData.name.trim());
			submitData.append('description', formData.description.trim());
			submitData.append('content', formData.content.trim());
			submitData.append('slug', formData.slug.trim());
			selectedCategories.forEach(item => submitData.append('categories[]', item));

			if (imageFile) {
				submitData.append('thumbnail', imageFile);
			}

			await axiosInstance.put(`/blogs/${publicId}`, submitData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			setSuccess(true);
			setTimeout(() => {
				navigate(`/admin/blogs/${publicId}`);
			}, 1500);
		} catch (err) {
			console.error('Error updating blog:', err);
			setError(err.response?.data?.message || 'Failed to update blog');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Header */}
			<Box display="flex" alignItems="center" mb={3}>
				<IconButton onClick={() => navigate('/admin/blogs')} sx={{ mr: 2 }}>
					<ArrowBackIcon />
				</IconButton>
				<Typography variant="h4" fontWeight="bold">
					Edit Blog
				</Typography>
			</Box>

			{/* Error/Success Messages */}
			{error && (
				<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity="success" sx={{ mb: 3 }}>
					Blog updated successfully! Redirecting...
				</Alert>
			)}

			{/* Form */}
			<Paper elevation={3} sx={{ p: 4 }}>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						{/* Blog Name */}
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Blog Name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
								variant="outlined"
							/>
						</Grid>

						{/* Slug */}
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Slug (URL-friendly)"
								name="slug"
								value={formData.slug}
								onChange={handleInputChange}
								required
								variant="outlined"
								helperText="Auto-generated from blog name, but you can customize it"
							/>
						</Grid>

						{/* Description */}
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								multiline
								rows={3}
								variant="outlined"
								helperText="Brief summary of the blog post"
							/>
						</Grid>

						{/* Content */}
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Content"
								name="content"
								value={formData.content}
								onChange={handleInputChange}
								required
								multiline
								rows={12}
								variant="outlined"
								helperText="Full blog content (you can use HTML or Markdown)"
							/>
						</Grid>

						{/* Categories */}
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel id="categories-label">Categories</InputLabel>
								<Select
									labelId="categories-label"
									multiple
									value={selectedCategories}
									onChange={handleCategoryChange}
									input={<OutlinedInput label="Categories" />}
									renderValue={selected => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{selected.map(value => {
												const category = categories.find(cat => cat.public_id === value);
												return (
													<Chip key={value} label={category?.name || value} size="small" />
												);
											})}
										</Box>
									)}
									MenuProps={MenuProps}
								>
									{categories.map(category => (
										<MenuItem key={category.public_id} value={category.public_id}>
											{category.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{/* Thumbnail Upload */}
						<Grid item xs={12}>
							<Typography variant="subtitle1" gutterBottom fontWeight="bold">
								Thumbnail Image
							</Typography>

							{/* Existing or Preview Image */}
							{(imagePreview || existingThumbnail) && (
								<Card sx={{ maxWidth: 400, mb: 2 }}>
									<CardMedia
										component="img"
										height="200"
										image={imagePreview || existingThumbnail}
										alt="Blog thumbnail"
									/>
								</Card>
							)}

							<Box display="flex" gap={2} alignItems="center">
								<Button variant="outlined" component="label" startIcon={<ImageIcon />}>
									{imagePreview ? 'Change Image' : 'Upload Image'}
									<input type="file" hidden accept="image/*" onChange={handleImageChange} />
								</Button>

								{imagePreview && (
									<Button
										variant="outlined"
										color="error"
										startIcon={<DeleteIcon />}
										onClick={handleRemoveImage}
									>
										Remove
									</Button>
								)}
							</Box>
							<Typography variant="caption" color="text.secondary" display="block" mt={1}>
								Accepted formats: JPG, PNG, GIF (Max 5MB)
							</Typography>
						</Grid>

						{/* Action Buttons */}
						<Grid item xs={12}>
							<Box display="flex" gap={2} justifyContent="flex-end">
								<Button
									variant="outlined"
									onClick={() => navigate('/admin/blogs')}
									disabled={submitting}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									variant="contained"
									startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
									disabled={submitting}
								>
									{submitting ? 'Saving...' : 'Save Changes'}
								</Button>
							</Box>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default EditBlogAdmin;
