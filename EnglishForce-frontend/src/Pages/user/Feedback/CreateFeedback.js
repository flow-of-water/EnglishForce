import React, { useState } from 'react';
import {
	Container,
	Paper,
	TextField,
	Button,
	Box,
	Typography,
	IconButton,
	Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../Api/axiosInstance';

const CreateFeedback = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		thumbnail: null,
	});
	const [thumbnailPreview, setThumbnailPreview] = useState(null);

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			setError('Image size must be less than 5MB');
			return;
		}
		if (!file.type.startsWith('image/')) {
			setError('Please select a valid image file');
			return;
		}

		setError('');
		setFormData(prev => ({ ...prev, thumbnail: file }));

		const reader = new FileReader();
		reader.onloadend = () => setThumbnailPreview(reader.result);
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = () => {
		setFormData(prev => ({ ...prev, thumbnail: null }));
		setThumbnailPreview(null);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setError('');

		if (!formData.title.trim() || !formData.content.trim()) {
			setError('Title and content are required');
			return;
		}

		try {
			setLoading(true);
			const submitData = new FormData();
			submitData.append('title', formData.title.trim());
			submitData.append('content', formData.content.trim());
			if (formData.thumbnail) {
				submitData.append('thumbnail', formData.thumbnail);
			}

			await axiosInstance.post('/feedbacks', submitData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			navigate('/feedback');
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to create feedback');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Box display="flex" alignItems="center" mb={3}>
				<IconButton onClick={() => navigate('/feedbacks')} sx={{ mr: 2 }}>
					<ArrowBackIcon />
				</IconButton>
				<Typography variant="h4" fontWeight="bold">
					Create Feedback
				</Typography>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
					{error}
				</Alert>
			)}

			<Paper sx={{ p: 4 }}>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Title"
						required
						value={formData.title}
						onChange={e => handleChange('title', e.target.value)}
						sx={{ mb: 3 }}
					/>

					<TextField
						fullWidth
						label="Content"
						required
						multiline
						rows={8}
						placeholder="Describe your feedback in detail..."
						value={formData.content}
						onChange={e => handleChange('content', e.target.value)}
						sx={{ mb: 3 }}
					/>

					{/* Thumbnail Upload */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle1" gutterBottom>
							Thumbnail Image (optional)
						</Typography>

						{thumbnailPreview && (
							<Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
								<Box
									component="img"
									src={thumbnailPreview}
									alt="Thumbnail preview"
									sx={{
										width: '100%',
										maxWidth: 400,
										height: 200,
										objectFit: 'cover',
										borderRadius: 2,
										border: '2px solid',
										borderColor: 'divider',
										display: 'block',
									}}
								/>
								<IconButton
									onClick={handleRemoveImage}
									size="small"
									sx={{
										position: 'absolute',
										top: 8,
										right: 8,
										bgcolor: 'background.paper',
										'&:hover': { bgcolor: 'error.light', color: 'white' },
									}}
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</Box>
						)}

						<Button
							variant="outlined"
							component="label"
							startIcon={<CloudUploadIcon />}
						>
							{thumbnailPreview ? 'Change Image' : 'Upload Image'}
							<input type="file" hidden accept="image/*" onChange={handleImageChange} />
						</Button>
						<Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
							Max size: 5MB · JPG, PNG, JPEG
						</Typography>
					</Box>

					<Box display="flex" gap={2}>
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={loading}
							startIcon={<SaveIcon />}
						>
							{loading ? 'Submitting...' : 'Submit Feedback'}
						</Button>
						<Button
							variant="outlined"
							size="large"
							onClick={() => navigate('/feedback')}
						>
							Cancel
						</Button>
					</Box>
				</form>
			</Paper>
		</Container>
	);
};

export default CreateFeedback;
