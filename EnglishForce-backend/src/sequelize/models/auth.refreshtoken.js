// models/auth.refreshtoken.js
export default (sequelize, DataTypes) => {
	const RefreshToken = sequelize.define(
		'RefreshToken',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			token_hash: { type: DataTypes.STRING(64), allowNull: false, unique: true }, // SHA-256 của token, không lưu token gốc
			family_id: { type: DataTypes.UUID, allowNull: false }, // nhóm các token sinh ra từ cùng 1 lần đăng nhập
			expires_at: { type: DataTypes.DATE, allowNull: false }, // sliding: gia hạn mỗi lần refresh
			absolute_expires_at: { type: DataTypes.DATE, allowNull: false }, // giới hạn cứng tính từ lúc đăng nhập
			revoked_at: { type: DataTypes.DATE, allowNull: true },
			replaced_by: { type: DataTypes.INTEGER, allowNull: true }, // id của token thay thế khi rotate
			user_agent: { type: DataTypes.STRING(255), allowNull: true },
			ip: { type: DataTypes.STRING(64), allowNull: true },
		},
		{
			tableName: 'refresh_tokens',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			indexes: [
				{ name: 'refresh_tokens_user_id_idx', fields: ['user_id'] },
				{ name: 'refresh_tokens_family_id_idx', fields: ['family_id'] },
			],
		}
	);

	RefreshToken.associate = models => {
		RefreshToken.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
	};

	return RefreshToken;
};
