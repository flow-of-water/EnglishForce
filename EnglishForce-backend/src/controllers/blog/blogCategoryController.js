import * as blogCategoryService from '../../services/blog/blogCategory.service.js';

export const getBlogCategories = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 6;
		const categories = await blogCategoryService.getBlogCategories(page, limit);
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const findBlogCategoryByPublicId = async (req, res) => {
	const { publicId } = req.params;
	try {
		const category = await blogCategoryService.findBlogCategoryByPublicId(publicId);
		res.status(200).json(category);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

export const createBlogCategory = async (req, res) => {
	try {
		const { name, description, color } = req.body;
		const newCategory = await blogCategoryService.createBlogCategory({ name, description, color });
		res.status(201).json(newCategory);
	} catch (error) {
		console.error(error);
		res.status(400).json({ error: error.message });
	}
};

export const updateBlogCategory = async (req, res) => {
	try {
		const { publicId } = req.params;
		const { name, description, color } = req.body;
		const updatedCategory = await blogCategoryService.updateBlogCategory(publicId, { name, description, color });
		res.status(200).json(updatedCategory);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteBlogCategory = async (req, res) => {
	try {
		const { publicId } = req.params;
		await blogCategoryService.deleteBlogCategory(publicId);
		res.status(204).send();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
