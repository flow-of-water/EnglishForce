// CREATE ALL:  npx sequelize-cli db:seed:all
// DELETE ALL:  npx sequelize-cli db:seed:undo:all
//
// CREATE:      npx sequelize-cli db:seed --seed seed-user.cjs
// DELETE:      npx sequelize-cli db:seed:undo --seed seed-user.cjs

'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);

    const users = [
      {
        public_id: uuidv4(),
        username: 'admin',
        password: bcrypt.hashSync('Admin@123', salt),
        email: 'admin@example.com',
        role: 'admin',
        stripe_customer_id: null,
      },
      {
        public_id: uuidv4(),
        username: 'instructor',
        password: bcrypt.hashSync('Instructor@123', salt),
        email: 'instructor@example.com',
        role: 'user',
        stripe_customer_id: null,
      },
      {
        public_id: uuidv4(),
        username: 'student1',
        password: bcrypt.hashSync('Student1@123', salt),
        email: 'student1@example.com',
        role: 'user',
        stripe_customer_id: null,
      },
      {
        public_id: uuidv4(),
        username: 'student2',
        password: bcrypt.hashSync('Student2@123', salt),
        email: 'student2@example.com',
        role: 'user',
        stripe_customer_id: null,
      },
    ];

    await queryInterface.bulkInsert('users', users, { returning: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;'
    );
  }
};
