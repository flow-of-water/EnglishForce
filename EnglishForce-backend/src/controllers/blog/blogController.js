import * as blogService from '../../services/blog/blog.service.js';

export const getBlogsController = async (req, res) => {
    try {
        const { owned, page } = req.query;
        const userId = req?.user?.id;
        const limit = 6;
        const pageNum = page ? parseInt(page) : 1;
        console.log('Fetching blogs with params:', { owned, page: pageNum, userId });

        const { blogs, totalPages } = await blogService.getBlogs(pageNum, limit, owned, userId);
        res.status(200).json({ blogs, totalPages, currentPage: pageNum });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
};

export const findBlogIdByPublicIdController = async (req, res) => {
    const { publicId } = req.params;
    try {
        const blogId = await blogService.findBlogIdByPublicId(publicId);
        res.status(200).json({ blogId });
    } catch (error) {
        console.error('Error finding blog by public_id:', error);
        res.status(404).json({ message: 'Blog not found' });
    }
};

export const findBlogBySlugController = async (req, res) => {
    const { slug } = req.params;
    try {
        const blog = await blogService.findBlogBySlug(slug);
        res.status(200).json({ blog });
    } catch (error) {
        console.error('Error finding blog by slug:', error);
        res.status(404).json({ message: 'Blog not found' });
    }   
};