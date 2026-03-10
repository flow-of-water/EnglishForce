import * as blogService from '../../services/blog/blog.service.js';

export const getBlogsController = async (req, res) => {
	try {
		const { owned, page } = req.query;
		const userId = req?.user?.id;
		const limit = 6;
		const pageNum = page ? parseInt(page) : 1;

		const { blogs, totalPages } = await blogService.getBlogs(pageNum, limit, owned, userId);
		res.status(200).json({ blogs, totalPages, currentPage: pageNum });
	} catch (error) {
		console.error('Error fetching blogs:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const findBlogIdByPublicIdController = async (req, res) => {
	const { publicId } = req.params;
	const userId = req?.user?.id;
	try {
		const blog = await blogService.findBlogIdByPublicId(publicId, userId);
		res.status(200).json({ blog });
	} catch (error) {
		console.error('Error finding blog by public_id:', error);
		res.status(404).json({ message: 'Blog not found' });
	}
};

export const findBlogBySlugController = async (req, res) => {
	const { slug } = req.params;
	const userId = req?.user?.id;
	try {
		const blog = await blogService.findBlogBySlug(slug, userId);
		res.status(200).json({ blog });
	} catch (error) {
		console.error('Error finding blog by slug:', error);
		res.status(404).json({ message: 'Blog not found' });
	}
};

export const createBlogController = async (req, res) => {
	try {
		const userId = req.user.id;
		const blogData = req.body;
		blogData.user_id = userId;
		const newBlog = await blogService.createBlog(blogData);
		res.status(201).json({ blog: newBlog });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateBlogController = async (req, res) => {
	try {
		const { publicId } = req.params;
		const blogData = req.body;
		if (req.file) {
			blogData.thumbnail = req.file.path;
		}
		const updatedBlog = await blogService.updateBlog(publicId, blogData);
		res.status(200).json({ blog: updatedBlog });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateBlogBySlugController = async (req, res) => {
	try {
		const { slug } = req.params;
		const blogData = req.body;
		if (req.file) {
			blogData.thumbnail = req.file.path;
		}
		const updatedBlog = await blogService.updateBlogBySlug(slug, blogData);
		res.status(200).json({ blog: updatedBlog });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteBlogController = async (req, res) => {
	try {
		const { publicId } = req.params;
		await blogService.deleteBlog(publicId);
		res.status(200).json({ message: 'Blog deleted successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
