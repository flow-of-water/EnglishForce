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
	TextField,
	Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import axiosInstance from '../../../Api/axiosInstance';
import * as Constants from '../../../Constants/index.js';

const STATUS_CONFIG = {
	not_supported: { label: 'Not Supported', color: 'default' },
	in_progress: { label: 'In Progress', color: 'info' },
	in_review: { label: 'In Review', color: 'warning' },
	completed: { label: 'Completed', color: 'success' },
	rejected: { label: 'Rejected', color: 'error' },
};

const FeedbackDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [feedback, setFeedback] = useState(null);
	const [loading, setLoading] = useState(true);
	const [replyContent, setReplyContent] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const isLoggedIn = !!localStorage.getItem(Constants.LOCAL_STORAGE.USERNAME);

	useEffect(() => {
		fetchFeedback();
	}, [id]);

	const fetchFeedback = async () => {
		try {
			setLoading(true);
			const response = await axiosInstance.get(`/feedbacks/${id}`);
			setFeedback(response.data);
		} catch (error) {
			console.error('Fetch feedback detail error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitReply = async () => {
		if (!replyContent.trim()) return;
		try {
			setSubmitting(true);
			const response = await axiosInstance.post(`/feedback-replies/${id}`, {
				content: replyContent.trim(),
			});
			setFeedback(prev => ({
				...prev,
				FeedbackReplies: [...(prev.FeedbackReplies || []), response.data],
			}));
			setReplyContent('');
		} catch (error) {
			console.error('Submit reply error:', error);
		} finally {
			setSubmitting(false);
		}
	};

	const formatDate = dateString => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
				<CircularProgress />
			</Box>
		);
	}

	if (!feedback) {
		return (
			<Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
				<Typography variant="h4">Feedback not found</Typography>
			</Container>
		);
	}

	const statusCfg = STATUS_CONFIG[feedback.status] || STATUS_CONFIG.in_review;

	return (
		<Container maxWidth="md" sx={{ py: 6 }}>
			<Box
				display="flex"
				alignItems="center"
				gap={1}
				mb={4}
				sx={{ cursor: 'pointer', width: 'fit-content' }}
				onClick={() => navigate('/feedbacks')}
			>
				<ArrowBackIcon />
				<Typography>Back to Feedback</Typography>
			</Box>

			<Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
				<Box display="flex" alignItems="center" gap={2} mb={3}>
					<Chip label={statusCfg.label} color={statusCfg.color} />
					<Box display="flex" alignItems="center" gap={0.5}>
						<CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
						<Typography variant="body2" color="text.secondary">
							{formatDate(feedback.created_at)}
						</Typography>
					</Box>
				</Box>

				<Typography variant="h4" fontWeight="bold" gutterBottom>
					{feedback.title}
				</Typography>

				{feedback.User && (
					<Stack direction="row" alignItems="center" spacing={1} mb={3}>
						<Avatar
							src={feedback.User.avatar}
							alt={feedback.User.username}
							sx={{ width: 36, height: 36 }}
						>
							{feedback.User.username?.[0]?.toUpperCase()}
						</Avatar>
						<Box>
							<Typography variant="body2" fontWeight="bold">
								{feedback.User.username}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Author
							</Typography>
						</Box>
					</Stack>
				)}

				<Divider sx={{ mb: 3 }} />

				{feedback.thumbnail && (
					<Box
						component="img"
						src={feedback.thumbnail}
						alt={feedback.title}
						sx={{
							width: '100%',
							maxHeight: 400,
							objectFit: 'cover',
							borderRadius: 2,
							mb: 3,
						}}
					/>
				)}

				<Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
					{feedback.content}
				</Typography>
			</Paper>

			{/* Replies */}
			<Typography variant="h6" fontWeight="bold" mb={2}>
				Replies ({feedback.FeedbackReplies?.length || 0})
			</Typography>

			<Stack spacing={2} mb={4}>
				{feedback.FeedbackReplies?.map(reply => (
					<Paper key={reply.id} elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={1}>
							<Avatar
								src={reply.User?.avatar}
								alt={reply.User?.username}
								sx={{ width: 30, height: 30, fontSize: 13 }}
							>
								{reply.User?.username?.[0]?.toUpperCase()}
							</Avatar>
							<Typography variant="body2" fontWeight="bold">
								{reply.User?.username}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								· {formatDate(reply.created_at)}
							</Typography>
						</Stack>
						<Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
							{reply.content}
						</Typography>
					</Paper>
				))}
			</Stack>

			{isLoggedIn && (
				<Paper elevation={0} sx={{ p: 3 }}>
					<Typography variant="subtitle1" fontWeight="bold" mb={2}>
						Add a Reply
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={3}
						placeholder="Write your reply..."
						value={replyContent}
						onChange={e => setReplyContent(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<Button
						variant="contained"
						endIcon={<SendIcon />}
						onClick={handleSubmitReply}
						disabled={submitting || !replyContent.trim()}
					>
						{submitting ? 'Sending...' : 'Send Reply'}
					</Button>
				</Paper>
			)}
		</Container>
	);
};

export default FeedbackDetail;
