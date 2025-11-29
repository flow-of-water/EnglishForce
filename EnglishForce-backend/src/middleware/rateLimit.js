import rateLimit from 'express-rate-limit';

export default function createRateLimiter(maxRequest = 500, windowMs = 60 * 1000) {
	return rateLimit({
		windowMs,
		max: maxRequest,
		message: 'API rate limit exceeded',
	});
}
