import db from '../../sequelize/models/index.js';
const { BlogCategory } = db;

export const getBlogCategories = async (page, limit) => {
	const result = await BlogCategory.findAndCountAll({
		order: [['id', 'ASC']],
		limit: limit,
		offset: (page - 1) * limit,
	});
	return {
		categories: result.rows.map(cat => cat.get({ plain: true })),
		currentPage: page,
		totalPages: Math.ceil(result.count / limit),
	};
};

export const findBlogCategoryByPublicId = async publicId => {
	const category = await BlogCategory.findOne({ where: { public_id: publicId } });
	if (!category) throw new Error('Blog category not found with that public_id');
	return category.get({ plain: true });
};

export const createBlogCategory = async ({ name, description, color }) => {
	const existingCategory = await BlogCategory.findOne({ where: { name } });
	if (existingCategory) throw new Error('Blog category with that name already exists');
	const newCategory = await BlogCategory.create({ name, description, color });
	return newCategory.get({ plain: true });
};

export const updateBlogCategory = async (publicId, { name, description, color }) => {
	const category = await BlogCategory.findOne({ where: { public_id: publicId } });
	if (!category) throw new Error('Blog category not found with that public_id');
	await category.update({ name, description, color });
	return category.get({ plain: true });
};

export const deleteBlogCategory = async publicId => {
	const category = await BlogCategory.findOne({ where: { public_id: publicId } });
	if (!category) throw new Error('Blog category not found with that public_id');
	await category.destroy();
};
