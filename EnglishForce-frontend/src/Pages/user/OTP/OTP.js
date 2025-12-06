import React, { useState, useRef, useEffect } from 'react';
import {
	Button,
	Container,
	Typography,
	Box,
	Paper,
	Alert,
	CircularProgress,
	TextField,
	InputAdornment,
} from '@mui/material';
import { LockOutlined, ArrowBack, MailOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import dayjs from 'dayjs';
import * as Constants from '../../../Constants';

const OTPVerificationPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
	const [expiresAt, setExpiresAt] = useState(null); // Expiry time from API
	const [timeRemaining, setTimeRemaining] = useState(0); // Calculated remaining seconds
	const [canResend, setCanResend] = useState(false);
	const inputRefs = useRef([]);

	// Calculate time remaining based on expires_at from API
	useEffect(() => {
		if (!expiresAt) return;

		const calculateRemaining = () => {
			const now = dayjs();
			const expiry = dayjs(expiresAt);
			const remaining = expiry.diff(now, 'second');

			if (remaining <= 0) {
				setTimeRemaining(0);
				setCanResend(true);
				return;
			}

			setTimeRemaining(remaining);
			setCanResend(false);
		};

		// Calculate immediately
		calculateRemaining();

		// Update every second
		const interval = setInterval(calculateRemaining, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	// Format timer display
	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	// Handle OTP input change
	const handleChange = (index, value) => {
		// Only allow numbers
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setError('');

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Handle backspace
	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	// Handle paste
	const handlePaste = e => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').trim();

		if (!/^\d{6}$/.test(pastedData)) {
			setError('Please paste a valid 6-digit code');
			return;
		}

		const newOtp = pastedData.split('');
		setOtp(newOtp);
		setError('');
		inputRefs.current[5]?.focus();
	};

	// Validate email
	const isValidEmail = email => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Send OTP
	const handleSendOTP = async () => {
		if (!email.trim()) {
			setError('Please enter your email');
			return;
		}

		if (!isValidEmail(email)) {
			setError('Please enter a valid email address');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/otp/request', {
				email: email.trim(),
				purpose: 'reset_password', // or whatever purpose you need
			});

			// Set expiry time from API response
			setExpiresAt(response.data.expires_at);
			setOtpSent(true);
			setCanResend(false);

			// Focus first OTP input
			setTimeout(() => {
				inputRefs.current[0]?.focus();
			}, 100);
		} catch (err) {
			// Handle rate limit error
			if (err.response?.status === 429) {
				setError(err.response?.data?.error || 'Please wait before requesting another OTP');
			} else {
				setError(err.response?.data?.error || 'Failed to send OTP');
			}
		} finally {
			setLoading(false);
		}
	};

	// Verify OTP
	const handleVerify = async () => {
		const otpCode = otp.join('');
		if (otpCode.length !== 6) {
			setError('Please enter all 6 digits');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/otp/verify', {
				email: email.trim(),
				code: otpCode,
                purpose: 'reset_password',
			});
			localStorage.setItem(Constants.LOCAL_STORAGE.RESET_PASSWORD_TOKEN, response.data.resetToken);
			localStorage.setItem(Constants.LOCAL_STORAGE.TOKEN, response.data.resetToken);
			
			navigate('/reset-password', { state: { email: email.trim() } });
		} catch (err) {
			setError(err.response?.data?.error || 'Invalid or expired OTP code');
			setOtp(['', '', '', '', '', '']); // Clear OTP
			inputRefs.current[0]?.focus();
		} finally {
			setLoading(false);
		}
	};

	// Resend OTP
	const handleResend = async () => {
		setLoading(true);
		setError('');
		setOtp(['', '', '', '', '', '']); // Clear previous OTP

		try {
			const response = await axiosInstance.post('/otp/request', {
				email: email.trim(),
				purpose: 'reset_password',
			});

			// Update expiry time
			setExpiresAt(response.data.expires_at);
			setCanResend(false);

			// Focus first OTP input
			inputRefs.current[0]?.focus();
		} catch (err) {
			// Handle rate limit error with wait time
			if (err.response?.status === 429) {
				setError(err.response?.data?.error || 'Please wait before requesting another OTP');
			} else {
				setError(err.response?.data?.error || 'Failed to resend OTP');
			}
		} finally {
			setLoading(false);
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
					{/* Back Button */}
					<Button
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
						sx={{
							mb: 2,
							textTransform: 'none',
							color: 'text.secondary',
							'&:hover': { backgroundColor: 'transparent', color: 'primary.main' },
						}}
					>
						Back
					</Button>

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
							{otpSent ? 'Verify OTP' : 'Request OTP'}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							{otpSent
								? `Enter the 6-digit code sent to ${email}`
								: 'Enter your email to receive verification code'}
						</Typography>
					</Box>

					{/* Error Alert */}
					{error && (
						<Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
							{error}
						</Alert>
					)}

					{/* Email Input */}
					<TextField
						fullWidth
						label="Email"
						type="email"
						margin="normal"
						required
						value={email}
						onChange={e => {
							setEmail(e.target.value);
							setError('');
						}}
						disabled={otpSent} // Disable after OTP sent
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MailOutline color="action" />
								</InputAdornment>
							),
						}}
						sx={{
							mb: 3,
							'& .MuiOutlinedInput-root': {
								borderRadius: 3,
								backgroundColor: '#fff',
							},
						}}
					/>

					{/* OTP Input Boxes - Only show after OTP sent */}
					{otpSent && (
						<>
							<Box
								sx={{
									display: 'flex',
									gap: { xs: 1, sm: 2 },
									justifyContent: 'center',
									mb: 3,
								}}
							>
								{otp.map((digit, index) => (
									<Box
										key={index}
										component="input"
										ref={el => (inputRefs.current[index] = el)}
										type="text"
										inputMode="numeric"
										maxLength={1}
										value={digit}
										onChange={e => handleChange(index, e.target.value)}
										onKeyDown={e => handleKeyDown(index, e)}
										onPaste={index === 0 ? handlePaste : undefined}
										sx={{
											width: { xs: 45, sm: 56 },
											height: { xs: 45, sm: 56 },
											fontSize: { xs: '20px', sm: '24px' },
											fontWeight: 700,
											textAlign: 'center',
											border: '2px solid',
											borderColor: digit ? 'primary.main' : 'rgba(0,0,0,0.12)',
											borderRadius: 3,
											outline: 'none',
											transition: 'all 0.2s',
											backgroundColor: '#fff',
											'&:focus': {
												borderColor: 'primary.main',
												boxShadow: '0 0 0 3px rgba(33,150,243,0.1)',
											},
											'&:hover': {
												borderColor: 'primary.light',
											},
										}}
									/>
								))}
							</Box>

							{/* Timer - Only show when OTP is sent */}
							<Typography
								variant="body2"
								textAlign="center"
								color={timeRemaining <= 60 ? 'error.main' : 'text.secondary'}
								sx={{ mb: 2, fontWeight: 600 }}
							>
								{timeRemaining > 0
									? `Time remaining: ${formatTime(timeRemaining)}`
									: 'OTP expired'}
							</Typography>
						</>
					)}

					{/* Action Button */}
					{!otpSent ? (
						// Send OTP Button
						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							onClick={handleSendOTP}
							disabled={loading}
							sx={{
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
							{loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
						</Button>
					) : (
						// Verify OTP Button
						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							onClick={handleVerify}
							disabled={loading}
							sx={{
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
							{loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
						</Button>
					)}

					{/* Resend OTP - Only show after OTP sent */}
					{otpSent && (
						<Box textAlign="center" mt={3}>
							<Typography variant="body2" color="text.secondary" display="inline">
								Didn't receive the code?{' '}
							</Typography>
							{canResend ? (
								<Button
									onClick={handleResend}
									disabled={loading}
									sx={{
										textTransform: 'none',
										fontWeight: 700,
										p: 0,
										minWidth: 'auto',
										'&:hover': { backgroundColor: 'transparent' },
									}}
								>
									Resend OTP
								</Button>
							) : (
								<Typography
									variant="body2"
									color="text.disabled"
									display="inline"
									sx={{ fontWeight: 600 }}
								>
									Resend in {formatTime(timeRemaining)}
								</Typography>
							)}
						</Box>
					)}

					{/* Change email option */}
					{otpSent && (
						<Box textAlign="center" mt={2}>
							<Button
								onClick={() => {
									setOtpSent(false);
									setOtp(['', '', '', '', '', '']);
									setExpiresAt(null);
									setError('');
								}}
								disabled={loading}
								sx={{
									textTransform: 'none',
									fontSize: '0.875rem',
									color: 'text.secondary',
									'&:hover': { backgroundColor: 'transparent', color: 'primary.main' },
								}}
							>
								Change email address
							</Button>
						</Box>
					)}
				</Paper>
			</Container>
		</Box>
	);
};

export default OTPVerificationPage;