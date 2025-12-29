// CREATE ALL:  npx sequelize-cli db:seed:all
// DELETE ALL:  npx sequelize-cli db:seed:undo:all

// npx sequelize-cli db:seed --seed seed-blogs.cjs
// npx sequelize-cli db:seed:undo --seed seed-blogs.cjs

'use strict';
const { v4: uuidv4 } = require('uuid');
const blogData = require('./BlogData/Blogs.cjs');


const categories = [
  {
    public_id: uuidv4(),
    name: 'Grammar Tips',
    description: 'Essential grammar rules and tips for English learners',
  },
  {
    public_id: uuidv4(),
    name: 'Vocabulary',
    description: 'Expand your English vocabulary with useful words and phrases',
  },
  {
    public_id: uuidv4(),
    name: 'TOEIC Preparation',
    description: 'Strategies and resources for TOEIC exam preparation',
  },
  {
    public_id: uuidv4(),
    name: 'Pronunciation',
    description: 'Improve your English pronunciation and speaking skills',
  },
  {
    public_id: uuidv4(),
    name: 'Study Methods',
    description: 'Effective techniques and methods for learning English',
  },
  {
    public_id: uuidv4(),
    name: 'Business English',
    description: 'Professional English for workplace communication',
  }
];

const blogCategoryMapping = {
  'mastering-english-grammar': ['Grammar Tips', 'Study Methods'],
  'how-to-improve-your-toeic-score-in-30-days': ['TOEIC Preparation', 'Study Methods'],
  'essential-vocabulary': ['Vocabulary', 'Study Methods'],
  'the-ultimate-guide-to-english-pronunciation': ['Pronunciation', 'Study Methods'],
  '50-business-english-phrases-you-need-to-know': ['Business English', 'Vocabulary'],
  'advanced-grammar': ['Grammar Tips', 'Vocabulary'],
  'writing-professional-emails-in-english': ['Business English', 'Study Methods']
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get first user from database
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users ORDER BY id LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!users || users.length === 0) {
      throw new Error('No users found in database. Please seed users first.');
    }

    const firstUserId = users[0].id;

    // Map blog data to database format
    const blogs = blogData.map(blog => ({
      public_id: uuidv4(),
      user_id: firstUserId,
      name: blog.name,
      description: blog.description,
      content: blog.content,
      slug: blog.slug,
      thumbnail: blog.thumbnail,
      thumbnail_public_id: null,
      created_at: blog.created_at,
      updated_at: blog.updated_at
    }));

    await queryInterface.bulkInsert('blog_categories', categories, {});
    await queryInterface.bulkInsert('blogs', blogs, {});

    const insertedCategories = await queryInterface.sequelize.query(
      'SELECT id, name FROM blog_categories ORDER BY id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const insertedBlogs = await queryInterface.sequelize.query(
      'SELECT * FROM blogs ORDER BY id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    console.log(`✅ Created ${blogs.length} blogs for user ID: ${firstUserId}`);

    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    const blogCategoryRelations = [];
    insertedBlogs.forEach(blog => {
      const categoryNames = blogCategoryMapping[blog.slug] || [];
      categoryNames.forEach(categoryName => {
        const categoryId = categoryMap[categoryName];
        if (categoryId) {
          blogCategoryRelations.push({
            blog_id: blog.id,
            blog_category_id: categoryId,
            created_at: new Date(),
            updated_at: new Date()
          });
        } 
      });
    });
    if (blogCategoryRelations.length > 0) {
      await queryInterface.bulkInsert('blog_blog_categories', blogCategoryRelations, {});
      console.log(`✅ Created ${blogCategoryRelations.length} blog-category relationships`);
    } else {
      console.warn('⚠️  No blog-category relationships created. Check your mapping.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('blogs', null, {});
    await queryInterface.bulkDelete('blog_categories', null, {});
  }
};