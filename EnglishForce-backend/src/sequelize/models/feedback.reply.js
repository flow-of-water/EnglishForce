export default (sequelize, DataTypes) => {
	const FeedbackReply = sequelize.define(
		'FeedbackReply',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
			feedback_id: { type: DataTypes.INTEGER, allowNull: false },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			content: { type: DataTypes.TEXT, allowNull: false },
		},
		{
			tableName: 'feedback_replies',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	FeedbackReply.associate = models => {
		FeedbackReply.belongsTo(models.Feedback, { foreignKey: 'feedback_id', onDelete: 'CASCADE' });
		FeedbackReply.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
	};

	return FeedbackReply;
};
