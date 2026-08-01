export default (sequelize, DataTypes) => {
	const Reaction = sequelize.define(
		'Reaction',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			reactable_type: {
				type: DataTypes.ENUM('course', 'comment', 'blog', 'feedback'),
				allowNull: false,
			},
			reactable_id: { type: DataTypes.INTEGER, allowNull: false },
			reaction_type: {
				type: DataTypes.ENUM('like', 'love', 'helpful', 'insightful'),
				allowNull: false,
			},
		},
		{
			tableName: 'reactions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			indexes: [
				{ fields: ['user_id', 'reactable_type', 'reactable_id'], unique: true }, // prevent duplicate reactions
				{ fields: ['reactable_type', 'reactable_id'] }, // query reactions for entity
			],
		}
	);

	Reaction.associate = models => {
		Reaction.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
	};

	return Reaction;
};
