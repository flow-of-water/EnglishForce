// models/auth.otpcode.js
export default (sequelize, DataTypes) => {
	const OtpCode = sequelize.define(
		'OtpCode',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
			user_id: { type: DataTypes.INTEGER, allowNull: true }, // có thể null nếu dùng cho đăng ký bằng email chưa có user
			email: { type: DataTypes.STRING, allowNull: false },
			purpose: {
				type: DataTypes.ENUM('login', 'signup', 'reset_password', 'verify_email'),
				allowNull: false,
				defaultValue: 'login',
			},
			code_hash: { type: DataTypes.STRING, allowNull: false },
			expires_at: { type: DataTypes.DATE, allowNull: false },
			attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
			consumed_at: { type: DataTypes.DATE, allowNull: true },
			last_sent_at: { type: DataTypes.DATE, allowNull: false },
		},
		{
			tableName: 'otp_codes',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	OtpCode.associate = models => {
		if (models.User) {
			OtpCode.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'SET NULL' });
		}
	};

	// tiện ích nhỏ
	OtpCode.scopeExpirable = function () {
		return {
			where: sequelize.where(sequelize.fn('NOW'), '<', sequelize.col('expires_at')),
		};
	};

	return OtpCode;
};
