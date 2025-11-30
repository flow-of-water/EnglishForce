import React, { useState } from 'react';
import {
	Button,
	TextField,
	Container,
	Typography,
	Box,
	Divider,
	Paper,
	Alert,
	InputAdornment,
	IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, MailOutline, LockOutlined } from '@mui/icons-material';
import axiosInstance from '../../Api/axiosInstance';
import OAuthLoginButtons from '../../Components/OAuthLoginButtons.js';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPw, setShowPw] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async e => {
		e.preventDefault();
		setError('');

		try {
			const response = await axiosInstance.post('/auth/login', {
				username: email,
				password,
			});

			const { accessToken, id, role } = response.data;

			localStorage.setItem('token', accessToken);
			localStorage.setItem('username', email);
			localStorage.setItem('userId', id);
			localStorage.setItem('userRole', role);
			window.location.href = '/';
		} catch (err) {
			setError('Invalid email or password');
		}
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'grid',
				placeItems: 'center',
				position: 'relative',
				overflow: 'hidden',
				px: 2,
				'&:before': {
					content: '""',
					position: 'absolute',
					inset: '-20%',
					background:
						'radial-gradient(800px 320px at 15% 0%, rgba(33,150,243,0.18), transparent 60%), radial-gradient(700px 280px at 90% 10%, rgba(156,39,176,0.16), transparent 60%)',
					zIndex: -1,
				},
			}}
		>
			<Container maxWidth="sm">
				<Paper
					elevation={0}
					sx={{
						p: { xs: 3, md: 4 },
						borderRadius: 4,
						backdropFilter: 'blur(8px)',
						background: 'linear-gradient(145deg,#ffffff 0%,#f9fbff 100%)',
						border: '1px solid rgba(25,118,210,0.12)',
						boxShadow: '0 18px 60px rgba(33,150,243,0.12)',
					}}
				>
					<Box textAlign="center" mb={2}>
						<Typography variant="h4" fontWeight={900} gutterBottom>
							Welcome Back!
						</Typography>
						<Typography variant="subtitle1" color="text.secondary">
							Please sign in to your account
						</Typography>
					</Box>

					{error && (
						<Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
							{error}
						</Alert>
					)}

					<Box component="form" noValidate onSubmit={handleLogin}>
						<TextField
							fullWidth
							label="User Name"
							type="text"
							margin="normal"
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<MailOutline color="action" />
									</InputAdornment>
								),
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 3,
									backgroundColor: '#fff',
								},
							}}
						/>

						<TextField
							fullWidth
							label="Password"
							type={showPw ? 'text' : 'password'}
							margin="normal"
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LockOutlined color="action" />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowPw(s => !s)}
											edge="end"
										>
											{showPw ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 3,
									backgroundColor: '#fff',
								},
							}}
						/>

						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							sx={{
								mt: 2.5,
								py: 1.2,
								borderRadius: 999,
								textTransform: 'none',
								fontWeight: 900,
								boxShadow: '0 12px 28px rgba(33,150,243,0.25)',
								'&:hover': { boxShadow: '0 16px 36px rgba(33,150,243,0.32)' },
							}}
							type="submit"
						>
							Login
						</Button>

						<Divider sx={{ my: 3 }}>or</Divider>

						<OAuthLoginButtons />

						<Typography mt={2} textAlign="center" color="text.secondary">
							Don&apos;t have an account?{' '}
							<a href="/register" style={{ fontWeight: 700, color: 'inherit' }}>
								Register here
							</a>
						</Typography>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

export default LoginPage;
