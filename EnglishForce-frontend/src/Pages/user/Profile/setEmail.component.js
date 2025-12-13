import React, { useEffect, useMemo, useState } from 'react';
import { TextField, Button, Typography, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import axiosInstance from '../../../Api/axiosInstance';

/**
 * Props:
 * - defaultEmail?: string
 * - purpose?: string               // gợi ý: 'update_email'
 * - onSuccess?: (newEmail) => void // gọi khi cập nhật xong
 * - resendCooldownSec?: number     // default 60
 * - otpLength?: number             // default 6
 */
const SetEmailWithOtp = ({
	defaultEmail = '',
	purpose = 'update_email',
	onSuccess,
	resendCooldownSec = 60,
	otpLength = 6,
}) => {
	const [step, setStep] = useState('email'); // 'email' | 'otp' | 'done'
	const [email, setEmail] = useState(defaultEmail);
	const [otp, setOtp] = useState('');
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState(''); // success/info message
	const [error, setError] = useState(''); // error message
	const [cooldown, setCooldown] = useState(0);

	const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
	const otpSanitized = useMemo(() => otp.replace(/\D/g, '').slice(0, otpLength), [otp, otpLength]);

	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setInterval(() => setCooldown(s => s - 1), 1000);
		return () => clearInterval(t);
	}, [cooldown]);

	const handleRequestOtp = async e => {
		e.preventDefault();
		setError('');
		setInfo('');
		if (!emailValid) {
			setError('Email is not valid.');
			return;
		}
		setLoading(true);
		try {
			// Backend gợi ý: POST /auth/otp/request  body: { email, purpose }
			const res = await axiosInstance.post('/otp/request', { email, purpose });
			setInfo(res?.data?.message || 'OTP is sent to your email.');
			setStep('otp');
			setCooldown(resendCooldownSec);
		} catch (err) {
			const msg =
				err?.response?.data?.error || err?.response?.data?.message || 'Cannot request OTP.';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (cooldown > 0) return;
		setError('');
		setInfo('');
		setLoading(true);
		try {
			const res = await axiosInstance.post('/auth/otp/request', { email, purpose });
			setInfo(res?.data?.message || 'Resent OTP successfully.');
			setCooldown(resendCooldownSec);
		} catch (err) {
			const msg = err?.response?.data?.error || err?.response?.data?.message || 'Cannot resend OTP.';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyAndUpdate = async e => {
		e.preventDefault();
		setError('');
		setInfo('');
		if (otpSanitized.length !== otpLength) {
			setError(`Fill up ${otpLength} OTP.`);
			return;
		}
		setLoading(true);
		try {
			// Backend gợi ý: POST /auth/otp/verify  body: { email, code, purpose }
			await axiosInstance.post('/auth/otp/verify', {
				email,
				code: otpSanitized,
				purpose,
			});

			// Sau khi verify thành công, cập nhật email user:
			// Backend gợi ý: PATCH /users/me/email { email }
			const res = await axiosInstance.patch('/users/me/email', { email });
			setInfo(res?.data?.message || 'Update email sucessfully.');
			setStep('done');
			onSuccess && onSuccess(email);
		} catch (err) {
			const msg = err?.response?.data?.error || err?.response?.data?.message || 'Fail to verify email.';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const pasteFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (text) setOtp(text.replace(/\D/g, '').slice(0, otpLength));
		} catch {
			// ignore
		}
	};

	return (
		<Stack spacing={2} sx={{ minWidth: 360 }}>
			{info && <Alert severity="success">{info}</Alert>}
			{error && <Alert severity="error">{error}</Alert>}

			{step === 'email' && (
				<form onSubmit={handleRequestOtp}>
					<TextField
						label="New Email"
						type="email"
						fullWidth
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
						sx={{ mt: 1 }}
						error={!!email && !emailValid}
						helperText={!!email && !emailValid ? 'Email is not valid' : ' '}
						autoFocus
					/>
					<Button type="submit" variant="contained" disabled={loading || !emailValid}>
						{loading ? 'Loading...' : 'Send OTP'}
					</Button>
				</form>
			)}

			{step === 'otp' && (
				<form onSubmit={handleVerifyAndUpdate}>
					<TextField
						label={`Nhập OTP (${otpLength} số)`}
						value={otpSanitized}
						onChange={e => setOtp(e.target.value)}
						inputMode="numeric"
						fullWidth
						required
						sx={{ mt: 1 }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton aria-label="Paste OTP" onClick={pasteFromClipboard}>
										<ContentPasteIcon />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
						<Button
							variant="outlined"
							onClick={() => {
								setStep('email');
								setOtp('');
								setError('');
								setInfo('');
							}}
						>
							Sửa email
						</Button>
						<Button type="button" variant="text" disabled={loading || cooldown > 0} onClick={handleResend}>
							{cooldown > 0 ? `Gửi lại OTP (${cooldown}s)` : 'Gửi lại OTP'}
						</Button>
						<Stack flexGrow={1} />
						<Button
							type="submit"
							variant="contained"
							disabled={loading || otpSanitized.length !== otpLength}
						>
							{loading ? 'Đang xác minh...' : 'Xác minh & Cập nhật'}
						</Button>
					</Stack>
				</form>
			)}

			{step === 'done' && (
				<Stack spacing={1}>
					<Typography variant="h6">Completed</Typography>
					<Typography variant="body2">
						Your email is updated: <strong>{email}</strong>
					</Typography>
					<Button variant="contained" onClick={() => onSuccess && onSuccess(email)}>
						Close
					</Button>
				</Stack>
			)}
		</Stack>
	);
};

export default SetEmailWithOtp;
