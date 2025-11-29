import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActionArea,
	Chip,
	CardMedia,
	Tooltip,
	LinearProgress,
	Divider,
} from '@mui/material';
import GradientTitle from '../../../Components/GradientTitle';
import CircularLoading from '../../../Components/Loading';

const ProgramPage = () => {
	const [programs, setPrograms] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchPrograms = async () => {
		try {
			const res = await axiosInstance.get(`/programs/status`);
			setPrograms(res.data);
		} catch (err) {
			console.error('Failed to fetch programs', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPrograms();
	}, []);

	const getChip = status => {
		switch (status) {
			case 'completed':
				return (
					<Chip
						label="Completed"
						color="success"
						size="small"
						sx={{
							fontWeight: 600,
							backdropFilter: 'blur(6px)',
							bgcolor: 'success.light',
							color: '#10451d',
						}}
					/>
				);
			case 'in_progress':
				return (
					<Chip
						label="In Progress"
						color="warning"
						size="small"
						sx={{
							fontWeight: 600,
							backdropFilter: 'blur(6px)',
							bgcolor: 'warning.light',
							color: '#6a4f00',
						}}
					/>
				);
			default:
				return (
					<Chip
						label="Not Started"
						variant="outlined"
						size="small"
						sx={{
							fontWeight: 600,
							borderColor: 'divider',
							color: 'text.secondary',
							backdropFilter: 'blur(6px)',
						}}
					/>
				);
		}
	};

	if (loading) return <CircularLoading />;

	return (
		<Box
			sx={{
				mt: 4,
				position: 'relative',
				'&:before': {
					content: '""',
					position: 'absolute',
					inset: -80,
					background:
						'radial-gradient(600px 200px at 20% 0%, rgba(33,150,243,0.08), transparent), radial-gradient(500px 200px at 90% 10%, rgba(156,39,176,0.07), transparent)',
					zIndex: -1,
				},
			}}
		>
			<GradientTitle>Learning Programs</GradientTitle>

			<Typography align="center" color="text.secondary" sx={{ maxWidth: 720, mx: 'auto', mb: 3 }}>
				Browse through our curated programs designed to level up your English with a premium learning
				experience.
			</Typography>

			<Grid container spacing={4}>
				{programs.map(program => {
					const total = program.totalLessons || 0;
					const done = program.learnedLessons || 0;
					const percent = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

					return (
						<Grid item xs={12} sm={6} md={4} key={program.public_id}>
							<Card
								sx={{
									height: '100%',
									borderRadius: 4,
									background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
									boxShadow: '0 10px 25px rgba(2, 24, 43, 0.06)',
									transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s',
									position: 'relative',
									'&:hover': {
										transform: 'translateY(-8px) scale(1.015)',
										boxShadow: '0 18px 55px rgba(33,150,243,0.18)',
									},
									'&:after': {
										content: '""',
										position: 'absolute',
										inset: 0,
										borderRadius: 4,
										padding: '1px',
										background:
											'linear-gradient(135deg, rgba(33,150,243,0.25), rgba(156,39,176,0.25))',
										WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
										WebkitMaskComposite: 'xor',
										maskComposite: 'exclude',
										pointerEvents: 'none',
									},
								}}
							>
								<CardActionArea
									component={Link}
									to={`/programs/${program.public_id}`}
									sx={{ display: 'block', height: '100%' }}
								>
									{/* Thumbnail block */}
									<Box sx={{ position: 'relative' }}>
										{program.thumbnail ? (
											<CardMedia
												component="img"
												height="180"
												image={program.thumbnail}
												alt={program.name}
												sx={{
													objectFit: 'cover',
													filter: 'saturate(1.05)',
												}}
											/>
										) : (
											<Box
												sx={{
													height: 180,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													background: 'linear-gradient(120deg, #e3f2fd, #f3e5f5)',
												}}
											>
												<Typography fontWeight={700} color="text.secondary">
													No Thumbnail
												</Typography>
											</Box>
										)}

										{/* overlay gradient + status chip */}
										<Box
											sx={{
												position: 'absolute',
												inset: 0,
												background:
													'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.0) 60%)',
											}}
										/>
										<Box
											sx={{
												position: 'absolute',
												top: 12,
												right: 12,
											}}
										>
											{getChip(program.progressStatus)}
										</Box>

										{/* subtle shine on hover */}
										<Box
											sx={{
												position: 'absolute',
												inset: 0,
												background:
													'linear-gradient(75deg, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.0) 60%)',
												transform: 'translateX(-120%)',
												transition: 'transform 0.8s ease',
												'.MuiCard-root:hover &': {
													transform: 'translateX(120%)',
												},
											}}
										/>
									</Box>

									<CardContent
										sx={{
											display: 'flex',
											flexDirection: 'column',
											gap: 1.25,
											p: 2.5,
										}}
									>
										<Tooltip title={program.name} placement="top-start">
											<Typography
												variant="h6"
												sx={{
													fontWeight: 800,
													lineHeight: 1.3,
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													letterSpacing: 0.1,
													transition: 'color .25s',
													'&:hover': { color: 'primary.main' },
												}}
											>
												{program.name}
											</Typography>
										</Tooltip>

										<Typography
											variant="body2"
											color="text.secondary"
											sx={{
												display: '-webkit-box',
												WebkitLineClamp: 3,
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												opacity: 0.9,
											}}
										>
											{program.description}
										</Typography>

										<Divider sx={{ my: 0.5, borderColor: 'rgba(0,0,0,0.06)' }} />

										{/* Progress + count */}
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.25,
												mt: 0.5,
											}}
										>
											<Box sx={{ flex: 1 }}>
												<LinearProgress
													variant="determinate"
													value={percent}
													sx={{
														height: 8,
														borderRadius: 20,
														backgroundColor: 'rgba(0,0,0,0.06)',
														'& .MuiLinearProgress-bar': {
															borderRadius: 20,
															transition: 'width .6s ease',
															background:
																percent === 100
																	? 'linear-gradient(90deg, #43a047, #66bb6a)'
																	: 'linear-gradient(90deg, #2196f3, #21cbf3)',
														},
													}}
												/>
											</Box>
											<Typography
												variant="caption"
												sx={{ minWidth: 62, textAlign: 'right', fontWeight: 600 }}
												color="text.secondary"
											>
												{done}/{total} {total > 1 ? 'lessons' : 'lesson'}
											</Typography>
										</Box>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					);
				})}

				{programs.length === 0 && (
					<Grid item xs={12}>
						<Box
							sx={{
								mt: 2,
								p: 4,
								textAlign: 'center',
								borderRadius: 4,
								background: 'linear-gradient(180deg, #f8fbff, #f9f5ff)',
								border: '1px solid rgba(0,0,0,0.06)',
							}}
						>
							<Typography variant="h6" fontWeight={800} gutterBottom>
								No learning programs available
							</Typography>
							<Typography color="text.secondary">New programs are coming soon. Stay tuned!</Typography>
						</Box>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

export default ProgramPage;
