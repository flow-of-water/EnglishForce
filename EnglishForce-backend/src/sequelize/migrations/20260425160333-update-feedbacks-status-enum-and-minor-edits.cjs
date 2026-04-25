'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
      ALTER TABLE feedbacks ALTER COLUMN status DROP DEFAULT;

      ALTER TABLE feedbacks ALTER COLUMN status TYPE TEXT;

      DROP TYPE IF EXISTS "enum_feedbacks_status";

      CREATE TYPE "enum_feedbacks_status"
        AS ENUM ('not_supported', 'in_progress', 'in_review', 'completed', 'rejected');

      UPDATE feedbacks SET status = CASE status
        WHEN 'complete' THEN 'completed'
        ELSE status
      END;

      ALTER TABLE feedbacks
        ALTER COLUMN status TYPE "enum_feedbacks_status"
        USING status::"enum_feedbacks_status",
        ALTER COLUMN status SET DEFAULT 'not_supported';
    `);

    await queryInterface.addColumn('blogs', 'views', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('feedbacks', 'url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
      ALTER TABLE feedbacks ALTER COLUMN status DROP DEFAULT;

      ALTER TABLE feedbacks ALTER COLUMN status TYPE TEXT;

      DROP TYPE IF EXISTS "enum_feedbacks_status";

      CREATE TYPE "enum_feedbacks_status"
        AS ENUM ('not_supported', 'in_progress', 'in_review', 'complete');

      UPDATE feedbacks SET status = CASE status
        WHEN 'completed' THEN 'complete'
        WHEN 'rejected'  THEN 'not_supported'
        ELSE status
      END;

      ALTER TABLE feedbacks
        ALTER COLUMN status TYPE "enum_feedbacks_status"
        USING status::"enum_feedbacks_status",
        ALTER COLUMN status SET DEFAULT 'not_supported';
    `);

    await queryInterface.removeColumn('blogs', 'views');

    await queryInterface.removeColumn('feedbacks', 'url');
	},
};