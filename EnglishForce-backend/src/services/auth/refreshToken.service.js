// services/auth/refreshToken.service.js
import crypto from 'crypto';
import { Op } from 'sequelize';
import db from '../../sequelize/models/index.js';

const { RefreshToken, sequelize } = db;

// Sliding: mỗi lần refresh gia hạn thêm 7 ngày
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
// Giới hạn cứng: tối đa 30 ngày kể từ lúc đăng nhập, sau đó phải đăng nhập lại
const ABSOLUTE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
// Token vừa bị rotate vẫn được chấp nhận trong khoảng này (2 tab cùng refresh 1 lúc)
const REUSE_GRACE_MS = 10 * 1000;

// SHA-256 là đủ (không cần bcrypt): token có 256 bit ngẫu nhiên và cần tra cứu nhanh theo index
const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

const createToken = async ({ userId, familyId, absoluteExpiresAt, meta = {} }, transaction) => {
	const token = crypto.randomBytes(32).toString('base64url');
	const expiresAt = new Date(Math.min(Date.now() + TTL_MS, absoluteExpiresAt.getTime()));

	const record = await RefreshToken.create(
		{
			user_id: userId,
			token_hash: hashToken(token),
			family_id: familyId,
			expires_at: expiresAt,
			absolute_expires_at: absoluteExpiresAt,
			user_agent: meta.userAgent?.slice(0, 255),
			ip: meta.ip,
		},
		{ transaction }
	);

	return { id: record.id, token, expiresAt };
};

/**
 * Issue a refresh token for a new login (starts a new token family)
 * @returns {Object} { token, expiresAt }
 */
export async function issueRefreshToken(userId, meta) {
	return createToken({
		userId,
		familyId: crypto.randomUUID(),
		absoluteExpiresAt: new Date(Date.now() + ABSOLUTE_TTL_MS),
		meta,
	});
}

/**
 * Exchange a refresh token for a new one and revoke the old one.
 * Presenting a token that was already revoked means someone else has a copy:
 * the whole family is revoked and the user has to log in again.
 * @returns {Object|null} { userId, token, expiresAt }, or null if the token is not usable
 */
export async function rotateRefreshToken(token, meta) {
	if (!token) return null;

	// Không throw trong transaction: việc revoke cả family phải được commit
	return sequelize.transaction(async transaction => {
		const current = await RefreshToken.findOne({
			where: { token_hash: hashToken(token) },
			lock: transaction.LOCK.UPDATE,
			transaction,
		});
		if (!current) return null;

		const now = new Date();

		if (current.revoked_at) {
			const justRotated = current.replaced_by && now - current.revoked_at <= REUSE_GRACE_MS;
			// Family còn token đang sống = chưa bị logout / đổi mật khẩu trong lúc đó
			const familyAlive =
				justRotated &&
				(await RefreshToken.count({
					where: { family_id: current.family_id, revoked_at: null, expires_at: { [Op.gt]: now } },
					transaction,
				})) > 0;

			if (!familyAlive) {
				await RefreshToken.update(
					{ revoked_at: now },
					{ where: { family_id: current.family_id, revoked_at: null }, transaction }
				);
				return null;
			}
		}

		if (current.expires_at <= now) return null;

		const next = await createToken(
			{
				userId: current.user_id,
				familyId: current.family_id,
				absoluteExpiresAt: current.absolute_expires_at,
				meta,
			},
			transaction
		);

		if (!current.revoked_at) {
			await current.update({ revoked_at: now, replaced_by: next.id }, { transaction });
		}

		return { userId: current.user_id, token: next.token, expiresAt: next.expiresAt };
	});
}

// Logout: thu hồi token của phiên hiện tại
export async function revokeRefreshToken(token) {
	if (!token) return;
	await RefreshToken.update(
		{ revoked_at: new Date() },
		{ where: { token_hash: hashToken(token), revoked_at: null } }
	);
}

// Đổi / đặt lại mật khẩu: thu hồi mọi phiên của user
export async function revokeAllRefreshTokensForUser(userId) {
	await RefreshToken.update({ revoked_at: new Date() }, { where: { user_id: userId, revoked_at: null } });
}

export async function deleteExpiredRefreshTokens() {
	return RefreshToken.destroy({ where: { expires_at: { [Op.lt]: new Date() } } });
}
