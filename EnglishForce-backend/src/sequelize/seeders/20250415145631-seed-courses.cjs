// Run seeders : npx sequelize-cli db:seed:all

'use strict';

module.exports =  {
  up: async (queryInterface, Sequelize) => {
    // Mock data for courses
    await queryInterface.bulkInsert('courses', [
      {
        name: 'English for Beginners',
        description: 'An introductory course designed for learners with no prior English experience.',
        instructor: 'Emily Johnson',
        price: 0.00,
      },
      {
        name: 'Intermediate English Conversation',
        description: 'Enhance your conversational skills for everyday situations.',
        instructor: 'Michael Smith',
        price: 19.99,
      },
      {
        name: 'Advanced English Grammar',
        description: 'Deep dive into complex grammar structures and usage.',
        instructor: 'Dr. Linda Thompson',
        price: 29.99,
      }
    ], {});

    // Mock data for course sections 
    await queryInterface.bulkInsert('course_sections', [
      {
        name: 'Intro',
        description: 'Start learning.',
        course_id: courses[0].id,
        video_link: 'https://video1.mp4',
        video_public_id: 'vid1',
        order_index: 0
      },
      {
        name: 'Vocabulary',
        description: 'Learn 100 words.',
        course_id: courses[0].id,
        video_link: 'https://video2.mp4',
        video_public_id: 'vid2',
        order_index: 1
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('courses', null, {});
  }
};

