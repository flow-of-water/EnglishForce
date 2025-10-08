import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: 'API rate limit exceeded'
});

export default limiter ;