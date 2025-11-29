import React, { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Paper,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	TextField,
	Grid,
	Box,
	Card,
	CardContent,
	Avatar,
} from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LineChart,
	Line,
	Cell,
} from 'recharts';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';
import ChangePassword from './ChangePassword.component.js';
import SetEmailWithOtp from './setEmail.component.js';

const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [openDialogPassword, setOpenDialogPassword] = useState(false); // For controlling Dialog visibility
	const [openDialogEmailOTP, setOpenDialogEmailOTP] = useState(false); // For controlling Dialog visibility
	const defaultAvatar = '/2.png';

	useEffect(() => {
		async function Fetch() {
			try {
				const response = await axiosInstance.get('/users/profile');
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching profile:', error);
				// Có thể hiển thị message lỗi hoặc set trạng thái lỗi
			} finally {
				setLoading(false);
			}
		}
		Fetch();
	}, []);

	const handleDialogOpenPassword = () => {
		setOpenDialogPassword(true);
	};

	const handleDialogClosePassword = () => {
		setOpenDialogPassword(false);
	};

	const handleDialogOpenEmailOTP = () => {
		setOpenDialogEmailOTP(true);
	};

	const handleDialogCloseEmailOTP = () => {
		setOpenDialogEmailOTP(false);
	};

	if (loading) {
		return <CircularLoading />;
	}
	const data = [
		{ name: 'Completed Program Lessons', value: user.stats?.programsCount || 0 },
		{ name: 'Exam Attempts', value: user.stats?.examAttemptsCount || 0 },
		{ name: 'Courses Purchased', value: user.stats?.coursesCount || 0 },
	];
	console.log('user : ', user);

	return (
		<Container>
			{user ? (
				<Paper style={{ padding: '20px' }}>
					<GradientTitle align="left">Profile</GradientTitle>
					<Card elevation={3} sx={{ borderRadius: 3 }}>
						<CardContent>
							<Grid container spacing={2} alignItems="center">
								<Grid item>
									<Avatar
										src={user.avatar || defaultAvatar}
										alt="User Avatar"
										sx={{ width: 100, height: 100 }}
									/>
								</Grid>
								<Grid item xs>
									<Typography variant="h6" gutterBottom>
										Username: <strong>{user.username}</strong>
									</Typography>
									<Typography variant="h6" gutterBottom>
										Role: <strong>{user.role}</strong>
									</Typography>
									<Typography variant="h6">
										Email:{' '}
										<strong>{user?.email ? user.email : <em>Bro, you need an email</em>}</strong>
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
					<Button variant="contained" color="primary" onClick={handleDialogOpenPassword} sx={{ mt: 3 }}>
						Change Password
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleDialogOpenEmailOTP}
						sx={{ mt: 3, ml: 2 }}
					>
						Set / Change Email
					</Button>

					<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
						Your General Learning Statistics
					</Typography>
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Legend />
							<Bar dataKey="value">
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={['#1976d2', '#e53935', '#fbc02d'][index % 3]} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>

					<Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
						Average Scores
					</Typography>
					<Typography variant="body1" sx={{ mb: 1 }}>
						Program Average Score: <strong>{user.stats?.averageScoreProgram * 100 || 0}%</strong>
					</Typography>
					<Typography variant="body1" sx={{ mb: 2 }}>
						Exam Average Score: <strong>{user.stats?.averageScoreExam || 0}%</strong>
					</Typography>

					{user.stats?.examScoresOverTime?.length > 0 && (
						<>
							<Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
								Exam Score Over Time
							</Typography>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={user.stats.examScoresOverTime}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="created_at"
										tickFormatter={date => new Date(date).toLocaleDateString()}
									/>
									<YAxis domain={[0, 100]} />
									<Tooltip labelFormatter={date => new Date(date).toLocaleString()} />
									<Legend />
									<Line type="monotone" dataKey="score" stroke="#82ca9d" activeDot={{ r: 8 }} />
								</LineChart>
							</ResponsiveContainer>
						</>
					)}

					{/* Dialog for Change Password */}
					<Dialog open={openDialogPassword} onClose={handleDialogClosePassword}>
						<DialogTitle>Change Password</DialogTitle>
						<DialogContent>
							<ChangePassword />
						</DialogContent>
					</Dialog>

					<Dialog open={openDialogEmailOTP} onClose={handleDialogCloseEmailOTP}>
						<DialogTitle>Set Email</DialogTitle>
						<DialogContent>
							<SetEmailWithOtp defaultEmail={user?.email || ''} purpose="update_email" />
						</DialogContent>
					</Dialog>
				</Paper>
			) : (
				<Typography variant="h6">No user data available</Typography>
			)}
		</Container>
	);
};

export default Profile;
