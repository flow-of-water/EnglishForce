import db from '../../sequelize/models/index.js'; // Sequelize instance
const { Blog, User, BlogCategory } = db;

const includeOptions = [
	{
		model: User,
		attributes: ['public_id', 'username', 'avatar'],
	},
	{
		model: BlogCategory,
		attributes: ['public_id', 'name', 'description', 'color'],
		through: { attributes: [] },
	},
];

export const getBlogs = async (page, limit, owned, userId) => {
	let blogs = [];
	let count = 0;
	const offset = (page - 1) * limit;

	const queryOptions = {
		include: includeOptions,
		limit,
		offset,
		order: [['id', 'DESC']],
		distinct: true,
	};

	if (owned == null || owned == undefined || owned == 0) {
	} else queryOptions.where = { user_id: userId };

	const result = await Blog.findAndCountAll(queryOptions);
	blogs = result.rows;
	count = result.count;

	return {
		totalItems: count,
		totalPages: Math.ceil(count / limit),
		currentPage: page,
		blogs: blogs.map(blog => blog.get({ plain: true })),
	};
};

export const findBlogIdByPublicId = async (publicId, userId = null) => {
	const blog = (await Blog.findOne({ where: { public_id: publicId }, include: includeOptions }))?.get({
		plain: true,
	});
	if (!blog) throw new Error('Blog not found with that public_id');
	blog.is_owned = userId != null && blog.user_id === userId;
	return blog;
};

export const findBlogBySlug = async (slug, userId = null) => {
	const blog = (await Blog.findOne({ where: { slug }, include: includeOptions }))?.get({ plain: true });
	if (!blog) throw new Error('Blog not found with that slug');
	blog.is_owned = userId != null && blog.user_id === userId;
	return blog;
};

export const createBlog = async blogData => {
	const { user_id, name, description, content, slug, thumbnail, category_ids } = blogData;
	const existingBlog = await Blog.findOne({ where: { slug: slug } });
	if (existingBlog) throw new Error('Blog with that slug already exists');

	const blog = await Blog.create({
		user_id,
		name,
		description,
		content,
		slug,
		thumbnail,
	});

	if (category_ids && category_ids.length > 0) {
		const categories = await BlogCategory.findAll({
			where: { id: category_ids },
		});

		if (categories.length !== category_ids.length) {
			await blog.destroy();
			throw new Error('One or more categories not found');
		}

		// Thêm associations vào bảng trung gian
		await blog.setBlogCategories(categories);
	}

	return blog.get({ plain: true });
};

export const updateBlog = async (publicId, blogData) => {
	const blog = await Blog.findOne({ where: { public_id: publicId } });
	if (!blog) throw new Error('Blog not found with that public_id');

	// Frontend sends "categories[]" which becomes "categories" after parsing
	const { categories, category_ids, ...updateData } = blogData;
	await blog.update(updateData);

	// Use categories (public_ids from frontend) or category_ids (internal ids)
	const categoryPublicIds = categories || category_ids;
	if (categoryPublicIds && categoryPublicIds.length > 0) {
		const categoryRecords = await BlogCategory.findAll({
			where: { public_id: categoryPublicIds },
		});
		await blog.setBlogCategories(categoryRecords);
	}

	return await Blog.findOne({ where: { public_id: publicId }, include: includeOptions });
};

export const updateBlogBySlug = async (slug, blogData) => {
	const blog = await Blog.findOne({ where: { slug } });
	if (!blog) throw new Error('Blog not found with that slug');

	// Frontend sends "categories[]" which becomes "categories" after parsing
	const { categories, category_ids, ...updateData } = blogData;
	await blog.update(updateData);

	// Use categories (public_ids from frontend) or category_ids (internal ids)
	const categoryPublicIds = categories || category_ids;
	if (categoryPublicIds && categoryPublicIds.length > 0) {
		const categoryRecords = await BlogCategory.findAll({
			where: { public_id: categoryPublicIds },
		});
		await blog.setBlogCategories(categoryRecords);
	}

	return await Blog.findOne({ where: { public_id: blog.public_id }, include: includeOptions });
};

export const deleteBlog = async publicId => {
	const blog = await Blog.findOne({ where: { public_id: publicId } });
	if (!blog) throw new Error('Blog not found with that public_id');
	await blog.destroy();
};
