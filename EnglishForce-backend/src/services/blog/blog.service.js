import db from '../../sequelize/models/index.js'; // Sequelize instance
const { Blog, User, BlogCategory } = db;

const includeOptions = [
    {
        model: User,
        attributes: ['public_id', 'username', 'avatar']
    },
    {
        model: BlogCategory,
        attributes: ['public_id', 'name', 'description', 'color'],
        through: { attributes: [] }
    }
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
    };

    if (owned == null || owned == undefined || owned == 0) {}
    else queryOptions.where = { user_id: userId };

    const result = await Blog.findAndCountAll(queryOptions);
    blogs = result.rows;
    count = result.count;

    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        blogs: blogs.map(blog => blog.get({ plain: true })),
    };
}

export const findBlogIdByPublicId = async publicId => {
    const blog = await Blog.findOne({ where: { public_id: publicId }, include: includeOptions });
    if (!blog) throw new Error('Blog not found with that public_id');
    return blog.get({ plain: true });
}

export const findBlogBySlug = async slug => {
    const blog = await Blog.findOne({ where: { slug }, include: includeOptions });
    if (!blog) throw new Error('Blog not found with that slug');
    return blog.get({ plain: true });
}

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
        thumbnail
    });

    if (category_ids && category_ids.length > 0) {
        const categories = await BlogCategory.findAll({
            where: { id: category_ids }
        });

        if (categories.length !== category_ids.length) {
            await blog.destroy();
            throw new Error('One or more categories not found');
        }

        // Thêm associations vào bảng trung gian
        await blog.setBlogCategories(categories);
    }


    return blog.get({ plain: true });
}

export const updateBlog = async (publicId, blogData) => {
    const blog = await Blog.findOne({ where: { public_id: publicId } });
    if (!blog) throw new Error('Blog not found with that public_id');
    await blog.update(blogData);
    return await Blog.findOne({ where: { public_id: publicId }, include: includeOptions });
}

export const deleteBlog = async publicId => {
    const blog = await Blog.findOne({ where: { public_id: publicId } });
    if (!blog) throw new Error('Blog not found with that public_id');
    await blog.destroy();
}