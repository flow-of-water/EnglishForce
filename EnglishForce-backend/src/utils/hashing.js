import bcrypt from 'bcrypt';

const DEFAULT_ROUNDS = Number(process.env.HASH_ROUNDS || 10);

/**
 * Hash any sensitive value (password, token, OTP, etc.)
 * chuyển giá trị gốc (như password, OTP, token) thành một chuỗi mã hoá (hash) an toàn
 */
export async function hashValue(value, rounds = DEFAULT_ROUNDS) {
	return bcrypt.hash(value, rounds);
}

/**
 * Verify a plain string against a hashed one.
 * kiểm tra xem giá trị người dùng nhập vào có khớp với hash đã lưu không
 */
export async function verifyHash(value, hash) {
	return bcrypt.compare(value, hash);
}
