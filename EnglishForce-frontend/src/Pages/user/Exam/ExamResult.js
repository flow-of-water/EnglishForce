import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Paper,
	Divider,
	Chip,
	Stack,
	CircularProgress as MUICircularProgress,
} from '@mui/material';
import {
	CheckCircleOutline,
	CancelOutlined,
	Schedule as ScheduleIcon,
	InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { green, red } from '@mui/material/colors';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';

const ExamResultPage = () => {
	const { attemptPublicId } = useParams();
	const location = useLocation();
	const selectedAnswers = location.state?.selectedAnswers || [];

	const [result, setResult] = useState(null);

	useEffect(() => {
		axiosInstance
			.get(`/exams/attempts/result/${attemptPublicId}`)
			.then(res => setResult(res.data))
			.catch(err => console.error('Error fetching result', err));
	}, [attemptPublicId]);

	if (!result) return <CircularLoading />;

	// ========= UI helpers =========
	const ScoreRing = ({ value }) => (
		<Box sx={{ position: 'relative', display: 'inline-flex' }}>
			<MUICircularProgress
				variant="determinate"
				value={Math.max(0, Math.min(100, Number(value) || 0))}
				size={120}
				thickness={5}
				sx={{
					color: 'primary.main',
					filter: 'drop-shadow(0 10px 25px rgba(33,150,243,0.25))',
					'& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
				}}
			/>
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: 'absolute',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				<Typography variant="h4" fontWeight={900} lineHeight={1}>
					{Number(value)}%
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Score
				</Typography>
			</Box>
		</Box>
	);

	let questionCounter = 1; // giữ nguyên: Q1, Q2, ...

	const renderPartRecursive = (part, partIndexPath = '') => {
		return (
			<Box key={part.public_id} mt={4}>
				{/* Part title */}
				<Typography
					variant="h5"
					sx={{
						mb: 1.5,
						fontWeight: 800,
						letterSpacing: 0.2,
					}}
				>
					{partIndexPath} {part.name}
				</Typography>
				<Divider
					sx={{
						mb: 2.5,
						borderColor: 'rgba(0,0,0,0.08)',
					}}
				/>

				{/* Questions */}
				{part.Questions?.map(q => {
					const userData = selectedAnswers.find(s => s.question_public_id === q.public_id);
					const userAnswers = userData?.selected_answers || [];
					const correctAnswers = (q.Answers || []).map(a => a.content);

					const isCorrect =
						userAnswers.length === correctAnswers.length &&
						[...userAnswers].sort().join(',') === [...correctAnswers].sort().join(',');

					const questionLabel = `Q${questionCounter++}`;

					return (
						<Paper
							key={q.public_id}
							sx={{
								p: 2.25,
								my: 1.25,
								borderRadius: 3,
								borderLeft: `6px solid ${isCorrect ? green[500] : red[500]}`,
								background: isCorrect
									? 'linear-gradient(145deg, #ffffff 0%, #f6fff8 100%)'
									: 'linear-gradient(145deg, #ffffff 0%, #fff6f6 100%)',
								boxShadow: '0 6px 20px rgba(2,24,43,0.06)',
							}}
						>
							{/* Question header */}
							<Stack direction="row" alignItems="center" spacing={1} mb={1}>
								<Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
									{questionLabel}. {q.content}
								</Typography>
								{isCorrect ? (
									<CheckCircleOutline sx={{ color: green[500] }} />
								) : (
									<CancelOutlined sx={{ color: red[500] }} />
								)}
							</Stack>

							{/* Your answers */}
							<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
								Your answer:
							</Typography>
							{userAnswers.length ? (
								<Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} mb={1}>
									{userAnswers.map((ua, idx) => (
										<Chip
											key={`${q.public_id}-ua-${idx}`}
											label={ua}
											size="small"
											variant={isCorrect ? 'filled' : 'outlined'}
											color={isCorrect ? 'success' : 'default'}
											sx={{ fontWeight: 600 }}
										/>
									))}
								</Stack>
							) : (
								<Chip
									label="N/A"
									size="small"
									variant="outlined"
									sx={{ mb: 1, color: 'text.secondary', borderColor: 'divider' }}
								/>
							)}

							{/* Correct answers */}
							<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
								Correct answer:
							</Typography>
							<Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
								{correctAnswers.map((ca, idx) => (
									<Chip
										key={`${q.public_id}-ca-${idx}`}
										label={ca}
										size="small"
										color="success"
										variant="outlined"
										sx={{ fontWeight: 700 }}
									/>
								))}
							</Stack>
						</Paper>
					);
				})}

				{/* Children parts */}
				{part.Children?.map((child, idx) => renderPartRecursive(child, `${partIndexPath}${idx + 1}.`))}
			</Box>
		);
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Hero summary */}
			<Box
				sx={{
					mb: 3.5,
					p: { xs: 2.5, md: 3 },
					borderRadius: 4,
					position: 'relative',
					overflow: 'hidden',
					background: 'linear-gradient(145deg, #ffffff 0%, #f6f9ff 100%)',
					boxShadow: '0 14px 44px rgba(33,150,243,0.12)',
					border: '1px solid rgba(25,118,210,0.12)',
				}}
			>
				{/* background accents */}
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						pointerEvents: 'none',
						background:
							'radial-gradient(400px 160px at 10% -10%, rgba(33,150,243,0.15), transparent), radial-gradient(380px 140px at 95% -15%, rgba(156,39,176,0.12), transparent)',
					}}
				/>

				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={3}
					alignItems="center"
					justifyContent="space-between"
					sx={{ position: 'relative' }}
				>
					<Stack spacing={1}>
						<Typography variant="h4" fontWeight={900} lineHeight={1.2}>
							Your Score
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
							Review your performance by section and question. Correct answers are highlighted for quick
							learning.
						</Typography>

						<Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
							<Chip
								icon={<ScheduleIcon />}
								label={`Exam attempt Duration: ${result.attemptDuration} minutes`}
								variant="outlined"
							/>
							{result?.examAttemptDescription && (
								<Chip
									icon={<InfoIcon />}
									label={`Description: ${result.examAttemptDescription}`}
									variant="outlined"
								/>
							)}
						</Stack>
					</Stack>

					<ScoreRing value={result.score} />
				</Stack>
			</Box>

			{/* Parts + Questions */}
			{result.parts.map((part, idx) => renderPartRecursive(part, `${idx + 1}.`))}

			<Divider sx={{ mt: 4, borderColor: 'rgba(0,0,0,0.08)' }} />
		</Container>
	);
};

export default ExamResultPage;
