// Run this seeders (already have .sequelizerc)
// CREATE:  npx sequelize-cli db:seed --seed 20250417100000-seed-exams.cjs
// DELETE:  npx sequelize-cli db:seed:undo --seed 20250417100000-seed-exams.cjs

'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insert Exam
    const [exam] = await queryInterface.bulkInsert('exams', [{
      public_id: uuidv4(),
      name: 'TOEIC Listening Practice Test 1',
      description: 'Practice Part 1 Listening for TOEIC',
      duration: 30,
    }], { returning: true });

    const examId = exam?.id;
    if (!examId) throw new Error('Insert exam failed.');

    // 2. Insert ExamPart
    const [examPart] = await queryInterface.bulkInsert('exam_parts', [{
      public_id: uuidv4(),
      exam_id: examId,
      name: 'Part 1: Photographs',
      description: 'Listen to the question and choose the correct answer.',
    }], { returning: true });

    const examPartId = examPart?.id;
    if (!examPartId) throw new Error('Insert exam part failed.');

    // 3. Insert Questions
    const insertedQuestions = await queryInterface.bulkInsert('questions', [
      {
        public_id: uuidv4(),
        exam_part_id: examPartId,
        exam_id:examId,
        content: 'What is the man doing in the picture?',
        thumbnail: 'https://example.com/image1.jpg',
        record: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        type: 'listening',
      },
      {
        public_id: uuidv4(),
        exam_part_id: examPartId,
        exam_id:examId,
        content: 'Where is the woman going?',
        thumbnail: null,
        record: 'https://example.com/audio2.mp3',
        type: 'listening',
      }
    ], { returning: true });

    if (!insertedQuestions || insertedQuestions.length < 2) {
      throw new Error('Insert questions failed.');
    }

    const [question1, question2] = insertedQuestions;

    // 4. Insert Answers
    await queryInterface.bulkInsert('answers', [
      {
        public_id: uuidv4(),
        question_id: question1.id,
        content: 'He is cooking.',
        is_correct: false,
      },
      {
        public_id: uuidv4(),
        question_id: question1.id,
        content: 'He is reading.',
        is_correct: true,
      },
      {
        public_id: uuidv4(),
        question_id: question2.id,
        content: 'To the supermarket.',
        is_correct: true,
      },
      {
        public_id: uuidv4(),
        question_id: question2.id,
        content: 'To the library.',
        is_correct: false,
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('exams', null, {});
    await queryInterface.bulkDelete('exam_parts', null, {});
    await queryInterface.bulkDelete('exam_attempts', null, {});
  }
};
