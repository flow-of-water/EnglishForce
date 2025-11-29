import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Box, Typography, Button, Chip, Stack, Divider, Paper } from '@mui/material';
import CircularLoading from '../../../Components/Loading';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ExamDetailPage = () => {
	const { publicId } = useParams();
	const [exam, setExam] = useState(null);
	const [attempts, setAttempts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchExamAndAttempts = async () => {
			try {
				const response = await axiosInstance.get(`/exams/${publicId}/short`);
				setExam(response.data);

				const attemptRes = await axiosInstance.get(`/exam-attempts/${publicId}/user`);
				setAttempts(attemptRes.data);
			} catch (err) {
				console.error('Failed to fetch exam details', err);
			}
		};
		fetchExamAndAttempts();
	}, [publicId]);

	if (!exam) return <CircularLoading />;

	return (
		<Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: '#f9fafc', minHeight: '100vh' }}>
			{/* Header */}
			<Box mb={6}>
				<Typography variant="h3" fontWeight={800} gutterBottom>
					{exam.name}
				</Typography>

				<Stack direction="row" spacing={2} alignItems="center" mb={2}>
					<Chip
						label={exam.type === 'toeic' ? 'TOEIC Exam' : 'General Exam'}
						color={exam.type === 'toeic' ? 'primary' : 'default'}
						icon={<QuizIcon />}
					/>
					<Chip label={`${exam.duration} minutes`} variant="outlined" icon={<AccessTimeIcon />} />
				</Stack>

				<Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
					{exam.description}
				</Typography>

				<Button
					variant="contained"
					size="large"
					component={Link}
					to={`/exams/${publicId}/start`}
					sx={{
						mt: 4,
						px: 5,
						py: 1.5,
						fontWeight: 700,
						fontSize: '1rem',
						background: 'linear-gradient(to right, #1976d2, #00c6ff)',
						boxShadow: '0 0 12px rgba(25, 118, 210, 0.4)',
						'&:hover': {
							background: 'linear-gradient(to right, #1565c0, #00bcd4)',
							transform: 'translateY(-1px)',
						},
					}}
				>
					Start Exam
				</Button>
				<Button
					variant="contained"
					onClick={() => navigate(-1)}
					size="large"
					sx={{
						mt: 4,
						ml: 2,
						px: 5,
						py: 1.5,
						fontWeight: 700,
						fontSize: '1rem',
						color: '#fff',
						background: 'linear-gradient(to right, #9e9e9e, #bdbdbd)',
						boxShadow: '0 0 8px rgba(158, 158, 158, 0.4)',
						textTransform: 'none',
						'&:hover': {
							background: 'linear-gradient(to right, #757575, #9e9e9e)',
							transform: 'translateY(-1px)',
						},
					}}
				>
					← Back
				</Button>
			</Box>

			{/* Attempt History */}
			{attempts.length > 0 && (
				<Box>
					<Typography variant="h5" fontWeight={700} gutterBottom>
						<HistoryIcon sx={{ mr: 1 }} /> Your Attempts
					</Typography>

					<Divider sx={{ mb: 3 }} />

					<Stack spacing={2}>
						{attempts.map((attempt, index) => (
							<Paper
								key={attempt.id}
								elevation={3}
								sx={{
									p: 2,
									borderLeft: '4px solid #1976d2',
									background: '#ffffff',
									transition: 'transform 0.2s',
									'&:hover': {
										transform: 'translateX(4px)',
									},
								}}
							>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="subtitle1" fontWeight={600}>
										Attempt #{index + 1}
									</Typography>
									<Chip
										icon={<CheckCircleIcon />}
										label={`Score: ${attempt.score} / 100`}
										color="success"
										variant="outlined"
										size="small"
									/>
								</Stack>
								<Typography variant="body2" color="text.secondary" mt={1}>
									Time: {new Date(attempt.start).toLocaleString()} →{' '}
									{new Date(attempt.end).toLocaleString()}
								</Typography>
							</Paper>
						))}
					</Stack>
				</Box>
			)}
		</Box>
	);
};

export default ExamDetailPage;
