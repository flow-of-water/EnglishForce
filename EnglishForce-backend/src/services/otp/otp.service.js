// services/otp.service.js
import dayjs from 'dayjs';
import { hashValue, verifyHash } from '../../utils/hashing.js';
import db from '../../sequelize/models/index.js';
import { sendMail, otpEmailTemplate } from '../../utils/mailer.js';
import { generateTokens } from '../../utils/jwt.js';

// TTL_MIN: thời gian sống của OTP (phút), mặc định 10.
const TTL_MIN = Number(process.env.OTP_TTL_MINUTES || 10);
// RESEND_COOLDOWN: số giây phải chờ trước khi xin mã mới, mặc định 60s.
const RESEND_COOLDOWN = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);

function genOPTCode() {
	// 6 chữ số, không có leading zero bug
	return String(Math.floor(100000 + Math.random() * 900000));
}

export async function requestOtp({ email, purpose = 'login', userId = null }) {
	const now = dayjs();
	const existing = await db.OtpCode.findOne({
		where: { email, purpose },
		order: [['created_at', 'DESC']],
	});

	if (existing && dayjs(existing.last_sent_at).add(RESEND_COOLDOWN, 'second').isAfter(now)) {
		const wait = dayjs(existing.last_sent_at).add(RESEND_COOLDOWN, 'second').diff(now, 'second');
		throw new Error(`Please wait ${wait}s before resending OTP.`);
	}

	const OTPcode = genOPTCode();
	const code_hash = await hashValue(OTPcode);
	const expires_at = now.add(TTL_MIN, 'minute').toDate();

	const record = await db.OtpCode.create({
		user_id: userId,
		email,
		purpose,
		code_hash,
		expires_at,
		attempts: 0,
		last_sent_at: now.toDate(),
	});

	await sendMail({
		to: email,
		subject: `${process.env.APP_NAME || 'App'} - Your OTP code`,
		html: otpEmailTemplate({
			appName: process.env.APP_NAME || 'App',
			OTPcode,
			ttlMinutes: TTL_MIN,
		}),
	});

	return { public_id: record.public_id, expires_at };
}

export async function verifyOtp({ email, purpose = 'login', code }) {
	const now = dayjs();
	const record = await db.OtpCode.findOne({
		where: { email, purpose },
		order: [['created_at', 'DESC']],
	});

	if (!record) throw new Error('OTP does not exist. Please request a new OTP code.');
	if (record.consumed_at) throw new Error('OTP has been used.');
	if (now.isAfter(dayjs(record.expires_at))) throw new Error('OTP has expired.');

	// limit attempts
	if (record.attempts >= 5)
		throw new Error('You have entered the wrong password too many times. Please create a new OTP.');

	const match = await verifyHash(code, record.code_hash);
	if (!match) {
		record.attempts += 1;
		await record.save();
		throw new Error('OTP code is incorrect.');
	}

	record.consumed_at = now.toDate();
	await record.save();

	// (tuỳ chọn) tự tạo user nếu purpose=signup và user chưa tồn tại
	// const user = await db.User.findOne({ where: { email } });

	return { ok: true };
}

export async function verifyOtpWithAuth({ email, code, purpose = 'login' }) {
	// Step 1: Verify OTP
	await verifyOtp({ email, purpose, code });

	// Step 2: Tìm hoặc tạo user
	let user = await db.User.findOne({ where: { email } });

	if (!user) return { ok: false };
	
	const { accessToken } = generateTokens(user, true);

	// Step 5: Return token và user info
	return {
		ok: true,
		resetToken: accessToken,
		user: {
			email: user.email,
			username: user.username,
		},
	};
}
