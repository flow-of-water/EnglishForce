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

export const adminMiddleware = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Admin access required' });
	}
	next();
};
