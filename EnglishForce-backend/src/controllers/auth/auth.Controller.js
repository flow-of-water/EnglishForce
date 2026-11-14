import { URLSearchParams } from 'url';
import { hashValue, verifyHash } from '../../utils/hashing.js';
import { generateAccessToken } from '../../utils/jwt.js';
import * as userService from '../../services/user.service.js';
import * as refreshTokenService from '../../services/auth/refreshToken.service.js';

const refreshTokenCookieOptions = {
	httpOnly: true, // Không thể truy cập qua JavaScript
	secure: process.env.NODE_ENV === 'production', // Chỉ HTTPS ở production
	sameSite: 'lax', // Chống CSRF
	path: '/api/auth', // Chỉ refresh-token / logout / change-password cần cookie này
};

// Store the refreshToken in an HttpOnly cookie
const setRefreshTokenCookie = (res, { token, expiresAt }) => {
	res.cookie('refreshToken', token, {
		...refreshTokenCookieOptions,
		maxAge: expiresAt.getTime() - Date.now(), // Thời gian sống của cookie
	});
};

// Important: the options must match those used when the cookie was set
const clearRefreshTokenCookie = res => res.clearCookie('refreshToken', refreshTokenCookieOptions);

const getClientMeta = req => ({ userAgent: req.get('user-agent'), ip: req.ip });

// Sign up - Đăng ký
export const register = async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await userService.getUserByUsername(username);
		if (existingUser) return res.status(409).json({ message: 'Username already taken' });

		const hashedPassword = await hashValue(password);
		const newUser = await userService.createUser(username, hashedPassword);
		res.status(201).json({ message: 'User registered', user: newUser });
	} catch (error) {
		res.status(500).json({ message: 'Error registering user', error });
	}
};

// Sign in - Đăng nhập
export const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await userService.getUserByUsername(username);
		if (!user) return res.status(400).json({ message: 'User not found' });

		const isMatch = await verifyHash(password, user.password);
		if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

		const accessToken = generateAccessToken(user);
		const refreshToken = await refreshTokenService.issueRefreshToken(user.id, getClientMeta(req));

		setRefreshTokenCookie(res, refreshToken);

		res.json({ accessToken, id: user.id, role: user.role, email: user.email });
	} catch (error) {
		res.status(500).json({ message: 'Error logging in', error });
	}
};

export const logout = async (req, res) => {
	try {
		// Thu hồi refreshToken trong DB rồi xóa cookie
		await refreshTokenService.revokeRefreshToken(req.cookies.refreshToken);
		clearRefreshTokenCookie(res);

		res.status(200).json({ message: 'Logged out successfully', success: true });
	} catch (error) {
		res.status(500).json({ message: 'Error logging out', error: error.message });
	}
};

// refesh access token
export const refreshToken = async (req, res) => {
	const { refreshToken } = req.cookies;

	if (!refreshToken) {
		return res.status(401).json({ message: 'Missing refresh token' });
	}

	try {
		// ✅ Xác thực refresh token và đổi sang token mới (rotation)
		const rotated = await refreshTokenService.rotateRefreshToken(refreshToken, getClientMeta(req));
		if (!rotated) {
			clearRefreshTokenCookie(res);
			return res.status(403).json({ message: 'Invalid or expired refresh token' });
		}

		const user = await userService.getUserById(rotated.userId);
		if (!user) {
			clearRefreshTokenCookie(res);
			return res.status(403).json({ message: 'User no longer exists' });
		}

		setRefreshTokenCookie(res, rotated);

		// ✅ Tạo access token mới
		res.json({ accessToken: generateAccessToken(user) });
	} catch (err) {
		return res.status(500).json({ message: 'Error refreshing token' });
	}
};

// Change Password
export const changePassword = async (req, res) => {
	const userId = req.user.id;
	const { currentPassword, newPassword } = req.body;

	try {
		const user = await userService.getUserById(userId);
		if (!user) return res.status(404).json({ message: "User don't exists" });

		const isMatch = await verifyHash(currentPassword, user.password);
		if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

		const hashedPassword = await hashValue(newPassword);
		await userService.updateUserPassword(userId, hashedPassword);

		// Đăng xuất mọi thiết bị khác, phiên hiện tại nhận refreshToken mới
		await refreshTokenService.revokeAllRefreshTokensForUser(userId);
		setRefreshTokenCookie(res, await refreshTokenService.issueRefreshToken(userId, getClientMeta(req)));

		res.status(200).json({ message: 'Password was changed' });
	} catch (error) {
		res.status(500).json({ message: 'Error when changing password', error });
	}
};

// Reset Password
export const resetPassword = async (req, res) => {
	try {
		const { newPassword } = req.body;

		// req.user đã được set bởi authMiddleware
		const userId = req.user.id;

		if (!newPassword) return res.status(400).json({ error: 'New password is required' });

		const user = await userService.getUserById(userId);

		if (!user) return res.status(404).json({ error: 'User not found' });

		// Hash new password using utility function
		const hashedPassword = await hashValue(newPassword);

		await user.update({ password: hashedPassword });

		// Đăng xuất mọi thiết bị đang đăng nhập bằng mật khẩu cũ
		await refreshTokenService.revokeAllRefreshTokensForUser(userId);

		res.json({
			message: 'Password reset successfully',
		});
	} catch (error) {
		console.error('Reset password error:', error);
		res.status(500).json({ error: 'Failed to reset password' });
	}
};

// ___ OAuth ___
// Google and Facebook
export const OAuthCallback = async (req, res) => {
	const user = await userService.findOrCreateUser(req.user); // req.user chính là Googleuser Hoặc Facebookuser
	const refreshToken = await refreshTokenService.issueRefreshToken(user.id, getClientMeta(req));

	setRefreshTokenCookie(res, refreshToken);

	// Không đưa token lên URL: frontend gọi /auth/refresh-token để lấy accessToken
	const params = new URLSearchParams({ username: user.username, userid: user.id, role: user.role });
	res.redirect(process.env.FRONT_END_URL + `/login/success?${params}`);
};
