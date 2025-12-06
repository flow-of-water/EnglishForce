import React, { useState } from 'react';
import {
	Button,
	Container,
	Typography,
	Box,
	Paper,
	Alert,
	TextField,
	InputAdornment,
	IconButton,
	CircularProgress,
} from '@mui/material';
import {
	LockOutlined,
	Visibility,
	VisibilityOff,
	CheckCircleOutline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import * as Constants from '../../../Constants/index';

const ResetPasswordPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	// Get email from previous step (passed via state)
	const email = location.state?.email || '';

	// Password strength validation
	const validatePassword = password => {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (password.length < minLength) {
			return 'Password must be at least 8 characters long';
		}
		if (!hasUpperCase) {
			return 'Password must contain at least one uppercase letter';
		}
		if (!hasLowerCase) {
			return 'Password must contain at least one lowercase letter';
		}
		if (!hasNumber) {
			return 'Password must contain at least one number';
		}
		if (!hasSpecialChar) {
			return 'Password must contain at least one special character';
		}
		return null;
	};

	// Get password strength level
	const getPasswordStrength = password => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.length >= 12) strength++;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

		if (strength <= 2) return { level: 'Weak', color: 'error.main' };
		if (strength <= 4) return { level: 'Medium', color: 'warning.main' };
		return { level: 'Strong', color: 'success.main' };
	};

	const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

	// Handle reset password
	const handleResetPassword = async e => {
		e.preventDefault();
		setError('');

		// Validation
		if (!newPassword || !confirmPassword) {
			setError('Please fill in all fields');
			return;
		}

		const passwordError = validatePassword(newPassword);
		if (passwordError) {
			setError(passwordError);
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (!email) {
			setError('Email not found. Please restart the password reset process');
			return;
		}

		setLoading(true);

		try {
			const resetToken = localStorage.getItem(Constants.LOCAL_STORAGE.RESET_PASSWORD_TOKEN);

			await axiosInstance.post('/auth/reset-password', {
				email: email.trim(),
				newPassword,
				token: resetToken,
			});

			localStorage.removeItem(Constants.LOCAL_STORAGE.RESET_PASSWORD_TOKEN);

			// Show success state
			setSuccess(true);
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	// Success state
	if (success) {
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
							textAlign: 'center',
						}}
					>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto 24px',
								boxShadow: '0 8px 24px rgba(76,175,80,0.25)',
							}}
						>
							<CheckCircleOutline sx={{ fontSize: 50, color: '#fff' }} />
						</Box>

						<Typography variant="h4" fontWeight={900} gutterBottom>
							Password Reset Successfully!
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
							Your password has been reset successfully.
						</Typography>
					</Paper>
				</Container>
			</Box>
		);
	}

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
					{/* Header */}
					<Box textAlign="center" mb={4}>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto 16px',
								boxShadow: '0 8px 24px rgba(102,126,234,0.25)',
							}}
						>
							<LockOutlined sx={{ fontSize: 40, color: '#fff' }} />
						</Box>

						<Typography variant="h4" fontWeight={900} gutterBottom>
							Reset Password
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							Enter your new password
						</Typography>
					</Box>

					{/* Error Alert */}
					{error && (
						<Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
							{error}
						</Alert>
					)}

					<Box component="form" noValidate onSubmit={handleResetPassword}>
						{/* New Password */}
						<TextField
							fullWidth
							label="New Password"
							type={showNewPassword ? 'text' : 'password'}
							margin="normal"
							required
							value={newPassword}
							onChange={e => {
								setNewPassword(e.target.value);
								setError('');
							}}
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
											onClick={() => setShowNewPassword(s => !s)}
											edge="end"
										>
											{showNewPassword ? <VisibilityOff /> : <Visibility />}
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

						{/* Password Strength Indicator */}
						{newPassword && passwordStrength && (
							<Box sx={{ mt: 1, mb: 2 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Box
										sx={{
											flex: 1,
											height: 6,
											borderRadius: 3,
											backgroundColor: 'rgba(0,0,0,0.08)',
											overflow: 'hidden',
										}}
									>
										<Box
											sx={{
												height: '100%',
												width:
													passwordStrength.level === 'Weak'
														? '33%'
														: passwordStrength.level === 'Medium'
															? '66%'
															: '100%',
												backgroundColor: passwordStrength.color,
												transition: 'all 0.3s',
											}}
										/>
									</Box>
									<Typography
										variant="caption"
										sx={{ color: passwordStrength.color, fontWeight: 600 }}
									>
										{passwordStrength.level}
									</Typography>
								</Box>
							</Box>
						)}

						{/* Confirm Password */}
						<TextField
							fullWidth
							label="Confirm Password"
							type={showConfirmPassword ? 'text' : 'password'}
							margin="normal"
							required
							value={confirmPassword}
							onChange={e => {
								setConfirmPassword(e.target.value);
								setError('');
							}}
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
											onClick={() => setShowConfirmPassword(s => !s)}
											edge="end"
										>
											{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

						{/* Password Requirements */}
						<Box
							sx={{
								mt: 2,
								p: 2,
								borderRadius: 2,
								backgroundColor: 'rgba(33,150,243,0.05)',
								border: '1px solid rgba(33,150,243,0.1)',
							}}
						>
							<Typography variant="caption" fontWeight={600} color="text.secondary">
								Password must contain:
							</Typography>
							<Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
								<Typography
									component="li"
									variant="caption"
									color={newPassword.length >= 8 ? 'success.main' : 'text.secondary'}
								>
									At least 8 characters
								</Typography>
								<Typography
									component="li"
									variant="caption"
									color={/[A-Z]/.test(newPassword) ? 'success.main' : 'text.secondary'}
								>
									One uppercase letter
								</Typography>
								<Typography
									component="li"
									variant="caption"
									color={/[a-z]/.test(newPassword) ? 'success.main' : 'text.secondary'}
								>
									One lowercase letter
								</Typography>
								<Typography
									component="li"
									variant="caption"
									color={/\d/.test(newPassword) ? 'success.main' : 'text.secondary'}
								>
									One number
								</Typography>
								<Typography
									component="li"
									variant="caption"
									color={
										/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
											? 'success.main'
											: 'text.secondary'
									}
								>
									One special character (!@#$%^&*)
								</Typography>
							</Box>
						</Box>

						{/* Submit Button */}
						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							type="submit"
							disabled={loading}
							sx={{
								mt: 3,
								py: 1.5,
								borderRadius: 999,
								textTransform: 'none',
								fontWeight: 900,
								fontSize: '1rem',
								boxShadow: '0 12px 28px rgba(33,150,243,0.25)',
								'&:hover': { boxShadow: '0 16px 36px rgba(33,150,243,0.32)' },
								'&.Mui-disabled': {
									backgroundColor: 'rgba(0,0,0,0.12)',
								},
							}}
						>
							{loading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								'Reset Password'
							)}
						</Button>

						{/* Back to Login */}
						<Box textAlign="center" mt={3}>
							<Typography variant="body2" color="text.secondary" display="inline">
								Remember your password?{' '}
							</Typography>
							<Button
								onClick={() => navigate('/login')}
								disabled={loading}
								sx={{
									textTransform: 'none',
									fontWeight: 700,
									p: 0,
									minWidth: 'auto',
									'&:hover': { backgroundColor: 'transparent' },
								}}
							>
								Back to Login
							</Button>
						</Box>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

export default ResetPasswordPage;