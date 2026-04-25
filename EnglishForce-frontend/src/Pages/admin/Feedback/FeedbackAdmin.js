import React, { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Stack,
	Avatar,
	Chip,
	Select,
	MenuItem,
	Button,
	Box,
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const STATUS_OPTIONS = [
	{ value: 'not_supported', label: 'Not Supported', color: 'default' },
	{ value: 'in_progress', label: 'In Progress', color: 'info' },
	{ value: 'in_review', label: 'In Review', color: 'warning' },
	{ value: 'completed', label: 'Completed', color: 'success' },
	{ value: 'rejected', label: 'Rejected', color: 'error' },
];

const statusColor = value => STATUS_OPTIONS.find(s => s.value === value)?.color || 'default';

const FeedbackAdmin = () => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);

	useEffect(() => {
		fetchFeedbacks();
	}, []);

	const fetchFeedbacks = async () => {
		try {
			setLoading(true);
			const response = await axiosInstance.get('/feedbacks');
			setFeedbacks(response.data);
		} catch (error) {
			console.error('Error fetching feedbacks:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (feedback, newStatus) => {
		setUpdatingId(feedback.id);
		try {
			await axiosInstance.put(`/feedbacks/${feedback.id}`, { status: newStatus });
			setFeedbacks(prev =>
				prev.map(f => (f.id === feedback.id ? { ...f, status: newStatus } : f))
			);
		} catch (error) {
			console.error('Error updating status:', error);
			alert('Failed to update status');
		} finally {
			setUpdatingId(null);
		}
	};

	const handleDelete = async (id, publicId) => {
		if (!window.confirm('Are you sure you want to delete this feedback?')) return;
		try {
			await axiosInstance.delete(`/feedbacks/${publicId}`);
			setFeedbacks(prev => prev.filter(f => f.id !== id));
		} catch (error) {
			console.error('Error deleting feedback:', error);
			alert('Failed to delete feedback');
		}
	};

	if (loading) return <CircularLoading />;

	return (
		<Container sx={{ mt: 4 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<GradientTitle align="left">Feedback Management</GradientTitle>
				<Typography variant="body2" color="text.secondary">
					{feedbacks.length} total
				</Typography>
			</Stack>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>Thumbnail</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Author</TableCell>
							<TableCell>Content</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Replies</TableCell>
							<TableCell>Created At</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{feedbacks.map((feedback, index) => (
							<TableRow key={feedback.id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>
									<Avatar
										src={feedback.thumbnail}
										alt={feedback.title}
										variant="rounded"
										sx={{ width: 60, height: 60 }}
									>
										{!feedback.thumbnail && feedback.title?.[0]?.toUpperCase()}
									</Avatar>
								</TableCell>
								<TableCell sx={{ maxWidth: 180 }}>
									<Typography variant="body2" fontWeight="bold" noWrap>
										{feedback.title}
									</Typography>
								</TableCell>
								<TableCell>{feedback.User?.username || 'Unknown'}</TableCell>
								<TableCell sx={{ maxWidth: 200 }}>
									<Typography variant="body2" color="text.secondary" noWrap>
										{feedback.content?.substring(0, 80)}
										{feedback.content?.length > 80 && '...'}
									</Typography>
								</TableCell>
								<TableCell>
									<Select
										value={feedback.status}
										size="small"
										disabled={updatingId === feedback.id}
										onChange={e => handleStatusChange(feedback, e.target.value)}
										sx={{ minWidth: 140 }}
										renderValue={value => (
											<Chip
												label={STATUS_OPTIONS.find(s => s.value === value)?.label || value}
												color={statusColor(value)}
												size="small"
											/>
										)}
									>
										{STATUS_OPTIONS.map(opt => (
											<MenuItem key={opt.value} value={opt.value}>
												<Chip label={opt.label} color={opt.color} size="small" />
											</MenuItem>
										))}
									</Select>
								</TableCell>
								<TableCell align="center">
									{feedback.FeedbackReplies?.length ?? 0}
								</TableCell>
								<TableCell>
									{new Date(feedback.created_at).toLocaleDateString()}
								</TableCell>
							</TableRow>
						))}
						{feedbacks.length === 0 && (
							<TableRow>
								<TableCell colSpan={9} align="center">
									No feedback found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default FeedbackAdmin;
