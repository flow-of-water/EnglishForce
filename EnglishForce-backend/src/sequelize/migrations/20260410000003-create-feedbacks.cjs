'use strict';

const OPTIONS = { ifNotExists: true };

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// ── 1. feedbacks ──────────────────────────────────────────────────────
		await queryInterface.createTable('feedbacks', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			title: { type: Sequelize.TEXT, allowNull: false },
			content: { type: Sequelize.TEXT, allowNull: false },
			thumbnail: { type: Sequelize.TEXT },
			thumbnail_public_id: { type: Sequelize.TEXT },
			status: {
				type: Sequelize.ENUM('not_supported', 'in_progress', 'in_review', 'complete'),
				allowNull: false,
				defaultValue: 'in_review',
			},
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
			updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);

		// ── 2. feedback_replies ───────────────────────────────────────────────
		await queryInterface.createTable('feedback_replies', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			feedback_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'feedbacks', key: 'id' }, onDelete: 'CASCADE' },
			user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			content: { type: Sequelize.TEXT, allowNull: false },
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
			updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('feedback_replies');
		await queryInterface.dropTable('feedbacks');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_feedbacks_status"');
	},
};
