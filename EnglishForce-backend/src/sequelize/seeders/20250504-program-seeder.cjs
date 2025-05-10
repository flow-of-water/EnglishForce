// npx sequelize-cli db:seed --seed 20250504-program-seeder.cjs
// npx sequelize-cli db:seed:undo --seed 20250504-program-seeder.cjs

'use strict';
const { v4: uuidv4 } = require('uuid');
const programData = require('./ProgramData/program1.cjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insert program
    const [program] = await queryInterface.bulkInsert(
      'programs',
      [{
        name: programData.name,
        description: programData.description,
        thumbnail: programData.thumbnail,
        order_index: programData.order_index,
        public_id: uuidv4()
      }],
      { returning: true }
    );

    const unitMap = new Map();
    const lessonMap = new Map();
    const exerciseMap = new Map();

    const allUnits = [];
    const allLessons = [];
    const allExercises = [];
    const allAnswers = [];

    // 2. Units → Lessons → Exercises → Answers
    for (const unit of programData.units) {
      const unitPublicId = uuidv4();
      const unitIdPlaceholder = Symbol(unit.name);
      unitMap.set(unitIdPlaceholder, { public_id: unitPublicId, name: unit.name });

      allUnits.push({
        program_id: program.id,
        name: unit.name,
        description: unit.description,
        order_index: unit.order_index,
        public_id: unitPublicId
      });

      for (const lesson of unit.lessons) {
        const lessonPublicId = uuidv4();
        const lessonIdPlaceholder = Symbol(lesson.name);
        lessonMap.set(lessonIdPlaceholder, { name: lesson.name, unitSymbol: unitIdPlaceholder });

        allLessons.push({
          unit_id: null, // resolve later
          name: lesson.name,
          description: lesson.description,
          order_index: lesson.order_index,
          public_id: lessonPublicId,
          _unitSymbol: unitIdPlaceholder,
          _lessonSymbol: lessonIdPlaceholder
        });

        for (const exercise of lesson.exercises) {
          const exercisePublicId = uuidv4();
          const exSymbol = Symbol(exercise.question);
          exerciseMap.set(exSymbol, { question: exercise.question, lessonSymbol: lessonIdPlaceholder });

          allExercises.push({
            lesson_id: null, // resolve later
            question: exercise.question,
            type: exercise.type,
            order_index: exercise.order_index,
            thumbnail: exercise.thumbnail || null,
            record: exercise.record || null,
            public_id: exercisePublicId,
            _lessonSymbol: lessonIdPlaceholder,
            _exerciseSymbol: exSymbol
          });

          for (const answer of exercise.answers) {
            allAnswers.push({
              content: answer.content,
              is_correct: answer.is_correct,
              exercise_id: null, // resolve later
              _exerciseSymbol: exSymbol
            });
          }
        }
      }
    }

    // 3. Insert units and build map: unit.name → unit.id
    const unitResults = await queryInterface.bulkInsert('units', allUnits, { returning: true });
    const unitIdMap = new Map();
    for (const unit of unitResults) {
      const match = [...unitMap.entries()].find(([, val]) => val.name === unit.name);
      if (match) unitIdMap.set(match[0], unit.id);
    }

    // 4. Resolve lessons with unit_id
    const resolvedLessons = allLessons.map(lesson => {
      const unitId = unitIdMap.get(lesson._unitSymbol);
      return {
        ...lesson,
        unit_id: unitId
      };
    });

    const lessonResults = await queryInterface.bulkInsert('lessons', resolvedLessons.map(({ _unitSymbol, _lessonSymbol, ...rest }) => rest), { returning: true });

    const lessonIdMap = new Map();
    for (const lesson of lessonResults) {
      const match = [...lessonMap.entries()].find(([, val]) => val.name === lesson.name && unitIdMap.get(val.unitSymbol) === lesson.unit_id);
      if (match) lessonIdMap.set(match[0], lesson.id);
    }

    // 5. Resolve exercises with lesson_id
    const resolvedExercises = allExercises.map(ex => {
      const lessonId = lessonIdMap.get(ex._lessonSymbol);
      return {
        ...ex,
        lesson_id: lessonId
      };
    });

    const exerciseResults = await queryInterface.bulkInsert('exercises', resolvedExercises.map(({ _lessonSymbol, _exerciseSymbol, ...rest }) => rest), { returning: true });

    const exerciseIdMap = new Map();
    for (const ex of exerciseResults) {
      const match = [...exerciseMap.entries()].find(([, val]) => val.question === ex.question && lessonIdMap.get(val.lessonSymbol) === ex.lesson_id);
      if (match) exerciseIdMap.set(match[0], ex.id);
    }

    // 6. Resolve answers with exercise_id
    const resolvedAnswers = allAnswers.map(ans => ({
      content: ans.content,
      is_correct: ans.is_correct,
      exercise_id: exerciseIdMap.get(ans._exerciseSymbol),
      public_id: uuidv4(),
    }));

    await queryInterface.bulkInsert('exercise_answers', resolvedAnswers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exercise_answers', null, {});
    await queryInterface.bulkDelete('exercises', null, {});
    await queryInterface.bulkDelete('lessons', null, {});
    await queryInterface.bulkDelete('units', null, {});
    await queryInterface.bulkDelete('programs', null, {});
  }
};
