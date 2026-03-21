import db from '../../sequelize/models/index.js';
const { BlogCategory, Sequelize } = db;
const { Op } = Sequelize;

export const getBlogCategories = async (page, limit, user) => {
	const where = user && user.role === 'admin' ? {} : { allowed_roles: { [Op.is]: null } };
	if(limit === null) {
		const allCategories = await BlogCategory.findAll({ where, order: [['id', 'ASC']] });
		return {
			categories: allCategories.map(cat => cat.get({ plain: true })),
			currentPage: 1,
			totalPages: 1,
		};
	}
	const result = await BlogCategory.findAndCountAll({
		where,
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

export const createBlogCategory = async ({ name, description, color, allowed_roles }) => {
	const existingCategory = await BlogCategory.findOne({ where: { name } });
	if (existingCategory) throw new Error('Blog category with that name already exists');
	const newCategory = await BlogCategory.create({ name, description, color, allowed_roles: allowed_roles});
	return newCategory.get({ plain: true });
};

export const updateBlogCategory = async (publicId, { name, description, color, allowed_roles }) => {
	const category = await BlogCategory.findOne({ where: { public_id: publicId } });
	if (!category) throw new Error('Blog category not found with that public_id');
	await category.update({ name, description, color, allowed_roles: allowed_roles});
	return category.get({ plain: true });
};

export const deleteBlogCategory = async publicId => {
	const category = await BlogCategory.findOne({ where: { public_id: publicId } });
	if (!category) throw new Error('Blog category not found with that public_id');
	await category.destroy();
};
