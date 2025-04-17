// Run all seeders : npx sequelize-cli db:seed:all

'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports =  {
  up: async (queryInterface, Sequelize) => {
    // Mock data for courses
    const courses = await queryInterface.bulkInsert('courses', [
      {
        public_id: uuidv4(),
        name: 'English for Beginners',
        description: 'An introductory course designed for learners with no prior English experience.',
        instructor: 'Emily Johnson',
        price: 0.00,
      },
      {
        public_id: uuidv4(),
        name: 'Intermediate English Conversation',
        description: 'Enhance your conversational skills for everyday situations.',
        instructor: 'Michael Smith',
        price: 19.99,
      },
      {
        public_id: uuidv4(),
        name: 'Advanced English Grammar',
        description: 'Deep dive into complex grammar structures and usage.',
        instructor: 'Dr. Linda Thompson',
        price: 29.99,
      }
    ], { returning: true });

    // Mock data for course sections 
    await queryInterface.bulkInsert('course_sections', [
      // Course 1 
      {
        public_id: uuidv4(),
        name: 'Alphabet and Pronunciation',
        description: 'Learn the English alphabet and basic pronunciation.',
        course_id: courses[0].id,
        video_link: 'https://www.youtube.com/watch?v=um3YrKRfsr0',
        video_public_id: null,
        order_index: 0
      },
      {
        public_id: uuidv4(),
        name: 'Basic Greetings',
        description: 'Common greetings and introductions in English.',
        course_id: courses[0].id,
        video_link: 'https://www.youtube.com/watch?v=sp3xU5WvRjA',
        video_public_id: null,
        order_index: 1
      },
      {
        public_id: uuidv4(),
        name: 'Numbers and Colors',
        description: 'Understanding numbers and colors in English.',
        course_id: courses[0].id,
        video_link: 'https://www.youtube.com/watch?app=desktop&v=FpNGuIY70fA',
        video_public_id: null,
        order_index: 2
      },
      {
        public_id: uuidv4(),
        name: 'Food and Drink',
        description: 'Talking about favorite foods, ordering at restaurants.',
        course_id: courses[0].id,
        video_link: 'https://www.youtube.com/watch?v=yezpvLy6eRM',
        video_public_id: null,
        order_index: 3
      },
      // Course 2
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('courses', null, {});
  }
};

