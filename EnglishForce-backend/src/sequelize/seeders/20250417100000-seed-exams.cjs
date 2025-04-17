// Run this seeders (already have .sequelizerc)
// CREATE:  npx sequelize-cli db:seed --seed 20250417100000-seed-exams.js
// DELETE:  npx sequelize-cli db:seed:undo --seed 20250417100000-seed-exams.js

'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Exam
    const examId = await queryInterface.bulkInsert('exams', [{
      public_id: uuidv4(),
      name: 'TOEIC Listening Practice Test 1',
      description: 'Practice Part 1 Listening for TOEIC',
      duration: 30, // in minutes
    }], { returning: true });

    const exam_id = examId[0]?.id || 1; // fallback nếu returning không hoạt động

    // 2. Question
    const questions = await queryInterface.bulkInsert('questions', [
      {
        public_id: uuidv4(),
        exam_id,
        content: 'What is the man doing in the picture?',
        thumbnail: 'https://example.com/image1.jpg',
        record: 'https://example.com/audio1.mp3',
        type: 'listening'
      },
      {
        public_id: uuidv4(),
        exam_id,
        content: 'Where is the woman going?',
        thumbnail: null,
        record: 'https://example.com/audio2.mp3',
        type: 'listening'
      }
    ], { returning: true });

    const questionIds = questions.map(q => q.id);

    // 3. Answer
    await queryInterface.bulkInsert('answers', [
      {
        public_id: uuidv4(),
        question_id: questionIds[0],
        content: 'He is cooking.',
        is_correct: false
      },
      {
        public_id: uuidv4(),
        question_id: questionIds[0],
        content: 'He is reading.',
        is_correct: true
      },
      {
        public_id: uuidv4(),
        question_id: questionIds[1],
        content: 'To the supermarket.',
        is_correct: true
      },
      {
        public_id: uuidv4(),
        question_id: questionIds[1],
        content: 'To the library.',
        is_correct: false
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('exams', null, {});
  }
};
