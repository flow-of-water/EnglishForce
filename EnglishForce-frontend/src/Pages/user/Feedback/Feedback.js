import React, { useState, useEffect } from 'react';
import {
	Container,
	Card,
	CardContent,
	Typography,
	Chip,
	Box,
	Avatar,
	Stack,
	Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import GradientTitle from '../../../Components/GradientTitle';
import CircularLoading from '../../../Components/Loading';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AddIcon from '@mui/icons-material/Add';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import * as Constants from '../../../Constants/index.js';

const STATUS_CONFIG = {
	not_supported: { label: 'Not Supported', color: 'default' },
	in_progress: { label: 'In Progress', color: 'info' },
	in_review: { label: 'In Review', color: 'warning' },
	completed: { label: 'Completed', color: 'success' },
	rejected: { label: 'Rejected', color: 'error' },
};

const FeedbackPage = () => {
	const navigate = useNavigate();
	const [feedbacks, setFeedbacks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchFeedbacks();
	}, []);

	const fetchFeedbacks = async () => {
		try {
			setLoading(true);
			const response = await axiosInstance.get('/feedbacks');
			setFeedbacks(response.data);
		} catch (error) {
			console.error('Fetch feedbacks error:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = dateString => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) return <CircularLoading />;

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Box mb={6} textAlign="center">
				<GradientTitle>Feedback</GradientTitle>
				<Typography variant="h6" color="text.secondary">
					Something broken? Have a feature request? Drop us a feedback here— we're listening.
				</Typography>
			</Box>

			{localStorage.getItem(Constants.LOCAL_STORAGE.USERNAME) && (
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => navigate('/feedbacks/create')}
					sx={{ mb: 3 }}
				>
					Create Feedback
				</Button>
			)}

			{localStorage.getItem(Constants.LOCAL_STORAGE.USER_ROLE) === 'admin' && (
				<Button
					variant="outlined"
					startIcon={<ManageAccountsIcon />}
					onClick={() => navigate('/admin/feedbacks')}
					sx={{ mb: 3, ml: 2 }}
				>
					Manage Feedback
				</Button>
			)}

			{feedbacks.length === 0 ? (
				<Box textAlign="center" py={10}>
					<FeedbackIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
					<Typography variant="h6" color="text.secondary">
						No feedback yet
					</Typography>
				</Box>
			) : (
				<Stack spacing={3}>
					{feedbacks.map(feedback => {
						const statusCfg = STATUS_CONFIG[feedback.status] || STATUS_CONFIG.in_review;
						return (
							<Card
								key={feedback.public_id}
								sx={{
									display: 'flex',
									flexDirection: { xs: 'column', sm: 'row' },
									cursor: 'pointer',
									transition: 'transform 0.2s, box-shadow 0.2s',
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: 6,
									},
								}}
								onClick={() => navigate(`/feedbacks/${feedback.public_id}`)}
							>
								{feedback.thumbnail ? (
									<Box
										component="img"
										src={feedback.thumbnail}
										alt={feedback.title}
										sx={{
											width: { xs: '100%', sm: 240 },
											height: { xs: 180, sm: 'auto' },
											objectFit: 'cover',
											flexShrink: 0,
										}}
									/>
								) : (
									<Box
										sx={{
											width: { xs: '100%', sm: 240 },
											height: { xs: 80, sm: 'auto' },
											flexShrink: 0,
											bgcolor: 'grey.100',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<FeedbackIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
									</Box>
								)}

								<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
									<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
										<Chip label={statusCfg.label} color={statusCfg.color} size="small" />
										<Box display="flex" alignItems="center" gap={0.5}>
											<CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
											<Typography variant="caption" color="text.secondary">
												{formatDate(feedback.created_at)}
											</Typography>
										</Box>
									</Box>

									<Typography variant="h6" fontWeight="bold" gutterBottom>
										{feedback.title}
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
											mb: 2,
											flexGrow: 1,
										}}
									>
										{feedback.content}
									</Typography>

									{feedback.User && (
										<Stack direction="row" alignItems="center" spacing={1} mt="auto">
											<Avatar
												src={feedback.User.avatar}
												alt={feedback.User.username}
												sx={{ width: 24, height: 24, fontSize: 12 }}
											>
												{feedback.User.username?.[0]?.toUpperCase()}
											</Avatar>
											<Typography variant="caption" color="text.secondary">
												{feedback.User.username}
											</Typography>
										</Stack>
									)}
								</CardContent>
							</Card>
						);
					})}
				</Stack>
			)}
		</Container>
	);
};

export default FeedbackPage;
