import jwt from 'jsonwebtoken';

// Configuration
export const config = {
	accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_secret',
	refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your_refresh_secret',
	accessTokenExpiry: '1m',
	refreshTokenExpiry: '7d',
	refreshTokenMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
	issuer: 'EnglishForce System',
	audience: 'EnglishForce user',
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

	const accessToken = jwt.sign(payload, config.accessSecret, {
		expiresIn: config.accessTokenExpiry,
		issuer: config.issuer,
		audience: config.audience,
	});

	if (onlyAccessToken) return { accessToken };

	const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
		expiresIn: config.refreshTokenExpiry,
		issuer: config.issuer,
		audience: config.audience,
	});

	return { accessToken, refreshToken };
};

/**
 * Verify JWT token (access or refresh)
 * @param {string} token - JWT token to verify
 * @param {string} type - Token type: 'access' or 'refresh'
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token, type = 'access') => {
	if (!token) throw new Error('Token is required');

	const secret = type === 'refresh' ? config.refreshSecret : config.accessSecret;

	try {
		return jwt.verify(token, secret, {
			issuer: config.issuer,
			audience: config.audience,
		});
	} catch (error) {
		if (error.name === 'TokenExpiredError')
			throw new Error(`${type === 'refresh' ? 'Refresh' : 'Access'} token has expired`);
		if (error.name === 'JsonWebTokenError')
			throw new Error(`Invalid ${type === 'refresh' ? 'refresh' : 'access'} token`);
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
