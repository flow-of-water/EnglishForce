import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
	const token = req.header('Authorization');
	if (!token) return res.status(401).json({ message: 'Unauthorized' });

	try {
		const decoded = verifyToken(token.replace('Bearer ', ''), 'access');
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ message: 'Invalid token' });
	}
};

export const authMiddlewareWithoutError = (req, res, next) => {
	const token = req.header('Authorization');
	if (token) {
		try {
			const decoded = verifyToken(token.replace('Bearer ', ''), 'access');
			req.user = decoded;
		} catch (err) {}
	}
	next();
};

export const optionalAuthMiddleware = async (req, res, next) => {
	const token = req.header('Authorization');
    
    // 🔵 CASE 1: Không có token → anonymous user → OK
    if (!token) {
		return res.status(200).json({ message: 'Anonymous user. You are not logged in.' });
    }

	// 🔵 CASE 2: Có token nhưng không hợp lệ → lỗi 401
	try {
		const decoded = verifyToken(token.replace('Bearer ', ''), 'access');
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ message: 'Invalid token' });
	}
}

export const adminMiddleware = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Admin access required' });
	}
	next();
};

export const authResetPasswordTokenMiddleware = (req, res, next) => {
	const token = req.cookies.resetToken;

	if (!token) return res.status(401).json({ message: 'Unauthorized - No token in cookie' });

	try {
		const decoded = verifyToken(token, 'access');
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ message: 'Invalid or expired token' });
	}
};