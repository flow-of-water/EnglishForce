import db from '../../sequelize/models/index.js'; // Sequelize instance
const { Blog } = db;


export const getBlogs = async (page, limit, owned, userId) => {
    let blogs = [];
    let count = 0;
    const offset = (page - 1) * limit;

    if (owned == null || owned == undefined || owned == 0) {
        const result = await Blog.findAndCountAll({ 
            limit, 
            offset, 
            order: [['id', 'DESC']] 
        });
        blogs = result.rows;
        count = result.count;
    } else if (userId) {
        const result = await Blog.findAndCountAll({ 
            where: { user_id: userId }, 
            limit, 
            offset, 
            order: [['id', 'DESC']] 
        });
        blogs = result.rows;
        count = result.count;
    }

    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        blogs: blogs.map(blog => blog.get({ plain: true })),
    };
}

export const findBlogIdByPublicId = async publicId => {
    const blog = await Blog.findOne({ where: { public_id: publicId } });
    if (!blog) throw new Error('Blog not found with that public_id');
    return blog.id;
}

export const findBlogBySlug = async slug => {
    const blog = await Blog.findOne({ where: { slug } });
    if (!blog) throw new Error('Blog not found with that slug');
    return blog.get({ plain: true });
}