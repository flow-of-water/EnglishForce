export default (sequelize, DataTypes) => {
	const Blog = sequelize.define(
		'Blog',
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
			user_id: { type: DataTypes.INTEGER },
			name: { type: DataTypes.TEXT, allowNull: false },
			description: DataTypes.TEXT,
			content: DataTypes.TEXT,
			slug: { type: DataTypes.TEXT, allowNull: false, unique: true }, // URL-friendly identifier
			thumbnail: DataTypes.TEXT,
			thumbnail_public_id: DataTypes.TEXT, // public ID image (Cloudinary)
			views: { type: DataTypes.INTEGER, defaultValue: 0 },
		},
		{
			tableName: 'blogs',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	Blog.associate = models => {
		Blog.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
		Blog.belongsToMany(models.BlogCategory, {
			through: 'blog_blog_categories',
			foreignKey: 'blog_id',
			otherKey: 'blog_category_id',
			onDelete: 'CASCADE',
		});
	};

	return Blog;
};
