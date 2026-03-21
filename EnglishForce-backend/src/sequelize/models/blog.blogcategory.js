export default (sequelize, DataTypes) => {
	const BlogCategory = sequelize.define(
		'BlogCategory',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
			name: { type: DataTypes.TEXT, allowNull: false, unique: true },
			description: DataTypes.TEXT,
			color: { type: DataTypes.STRING, defaultValue: '#007BFF' },
			allowed_roles: {
				type: DataTypes.TEXT,
				allowNull: true, // null means available to all roles
				comment: 'String role names/IDs that can use this category. Null = all roles',
			},
		},
		{
			tableName: 'blog_categories',
			timestamps: false,
		}
	);

	BlogCategory.associate = models => {
		BlogCategory.belongsToMany(models.Blog, {
			through: 'blog_blog_categories',
			foreignKey: 'blog_category_id',
			otherKey: 'blog_id',
			onDelete: 'CASCADE',
		});
	};

	return BlogCategory;
};
