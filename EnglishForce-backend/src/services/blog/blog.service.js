import db from '../../sequelize/models/index.js'; // Sequelize instance
const { Blog } = db;


export const getBlogs = async () => {
    const blogs = await Blog.findAll();
    return blogs.map(blog => blog.get({ plain: true }));
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