import jwt from 'jsonwebtoken';

// Configuration
export const config = {
	issuer: 'EnglishForce System',
	ACCESS_TOKEN: {
		secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_secret',
		audience: 'EnglishForce user',
		expiry: '10m',
	},
	REFRESH_TOKEN: {
		secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your_refresh_secret',
		audience: 'EnglishForce user',
		expiry: '7d',
		expiry_in_ms: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
	},
	RESET_TOKEN: {
		secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_secret',
		audience: 'EnglishForce password reset',
		expiry: '15m',
		expiry_in_ms: 15 * 60 * 1000, // 15 minutes in milliseconds
	},
};

/**
 * Generate access and refresh tokens
 * @param {Object} user - User object
 * @param {string} user.id - User ID
 * @param {string} user.username - Username
 * @param {string} user.role - User role
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateTokens = (user, onlyAccessToken = false) => {
	if (!user || !user.id) throw new Error('User object with id is required');

	const payload = {
		id: user.id,
		username: user.username,
		role: user.role,
	};

	const accessToken = jwt.sign(payload, config.ACCESS_TOKEN.secret, {
		expiresIn: config.ACCESS_TOKEN.expiry,
		issuer: config.issuer,
		audience: config.ACCESS_TOKEN.audience,
	});

	if (onlyAccessToken) return { accessToken };

	const refreshToken = jwt.sign({ id: user.id }, config.REFRESH_TOKEN.secret, {
		expiresIn: config.REFRESH_TOKEN.expiry,
		issuer: config.issuer,
		audience: config.REFRESH_TOKEN.audience,
	});

	return { accessToken, refreshToken };
};

/**
 * Generate a password-reset token (issued after OTP verification).
 * Its own audience keeps it from being accepted as an access token, and vice versa.
 * @param {Object} user - User object
 * @returns {string} resetToken
 */
export const generateResetToken = user => {
	if (!user || !user.id) throw new Error('User object with id is required');

	return jwt.sign({ id: user.id }, config.RESET_TOKEN.secret, {
		expiresIn: config.RESET_TOKEN.expiry,
		issuer: config.issuer,
		audience: config.RESET_TOKEN.audience,
	});
};

const TOKEN_CONFIG = {
	access: config.ACCESS_TOKEN,
	refresh: config.REFRESH_TOKEN,
	reset: config.RESET_TOKEN,
};

/**
 * Verify JWT token (access, refresh or reset)
 * @param {string} token - JWT token to verify
 * @param {string} type - Token type: 'access', 'refresh' or 'reset'
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token, type = 'access') => {
	if (!token) throw new Error('Token is required');
	if (!TOKEN_CONFIG[type]) throw new Error(`Unknown token type: ${type}`);

	const { secret, audience } = TOKEN_CONFIG[type];

	try {
		return jwt.verify(token, secret, {
			issuer: config.issuer,
			audience,
		});
	} catch (error) {
		if (error.name === 'TokenExpiredError')
			throw new Error(`${type[0].toUpperCase() + type.slice(1)} token has expired`);
		if (error.name === 'JsonWebTokenError') throw new Error(`Invalid ${type} token`);
		throw error;
	}
};

/**
 * Decode token without verification
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
export const decodeToken = token => {
	return jwt.decode(token);
};
