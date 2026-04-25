export default (sequelize, DataTypes) => {
	const Feedback = sequelize.define(
		'Feedback',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			title: { type: DataTypes.TEXT, allowNull: false },
			content: { type: DataTypes.TEXT, allowNull: false },
			thumbnail: DataTypes.TEXT,
			thumbnail_public_id: DataTypes.TEXT,
			status: {
				type: DataTypes.ENUM('not_supported', 'in_progress', 'in_review', 'completed', 'rejected'),
				allowNull: false,
				defaultValue: 'not_supported',
			},
			url: DataTypes.TEXT,
		},
		{
			tableName: 'feedbacks',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	Feedback.associate = models => {
		Feedback.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
		Feedback.hasMany(models.FeedbackReply, { foreignKey: 'feedback_id', onDelete: 'CASCADE' });
	};

	return Feedback;
};
