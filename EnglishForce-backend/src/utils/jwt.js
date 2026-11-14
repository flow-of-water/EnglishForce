import jwt from 'jsonwebtoken';

// Fail fast instead of signing with a guessable default secret
const requireEnv = name => {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required environment variable: ${name}`);
	return value;
};

const accessTokenSecret = requireEnv('JWT_ACCESS_TOKEN_SECRET');

// Configuration
// (Refresh tokens are opaque random strings stored in DB: see services/auth/refreshToken.service.js)
export const config = {
	issuer: 'EnglishForce System',
	ACCESS_TOKEN: {
		secret: accessTokenSecret,
		audience: 'EnglishForce user',
		expiry: '10m',
	},
	RESET_TOKEN: {
		secret: accessTokenSecret,
		audience: 'EnglishForce password reset',
		expiry: '15m',
		expiry_in_ms: 15 * 60 * 1000, // 15 minutes in milliseconds
	},
};

/**
 * Generate an access token
 * @param {Object} user - User object
 * @param {string} user.id - User ID
 * @param {string} user.username - Username
 * @param {string} user.role - User role
 * @returns {string} accessToken
 */
export const generateAccessToken = user => {
	if (!user || !user.id) throw new Error('User object with id is required');

	const payload = {
		id: user.id,
		username: user.username,
		role: user.role,
	};

	return jwt.sign(payload, config.ACCESS_TOKEN.secret, {
		expiresIn: config.ACCESS_TOKEN.expiry,
		issuer: config.issuer,
		audience: config.ACCESS_TOKEN.audience,
	});
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
	reset: config.RESET_TOKEN,
};

/**
 * Verify JWT token (access or reset)
 * @param {string} token - JWT token to verify
 * @param {string} type - Token type: 'access' or 'reset'
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
