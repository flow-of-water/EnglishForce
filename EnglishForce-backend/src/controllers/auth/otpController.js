import { requestOtp, verifyOtpWithAuth } from '../../services/otp/otp.service.js';

export const requestOtpController = async (req, res) => {
	try {
		const { email, purpose = 'login' } = req.body;

		// Validation
		if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

		// Gọi service layer
		const data = await requestOtp({ email, purpose });

		res.json({ success: true, message: 'OTP has been sent via email.', ...data });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const verifyOtpController = async (req, res) => {
	try {
		const { email, code, purpose = 'login' } = req.body;

		// Validation
		if (!email || !code) {
			return res.status(400).json({
				error: 'email & code are required',
			});
		}

		// Gọi service xử lý toàn bộ logic
		const result = await verifyOtpWithAuth({ email, code, purpose });

		res.json(result);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
};
