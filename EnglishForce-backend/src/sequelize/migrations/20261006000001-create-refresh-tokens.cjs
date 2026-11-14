'use strict';

const OPTIONS = { ifNotExists: true };

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('refresh_tokens', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			token_hash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
			family_id: { type: Sequelize.UUID, allowNull: false },
			expires_at: { type: Sequelize.DATE, allowNull: false },
			absolute_expires_at: { type: Sequelize.DATE, allowNull: false },
			revoked_at: { type: Sequelize.DATE, allowNull: true },
			replaced_by: { type: Sequelize.INTEGER, allowNull: true },
			user_agent: { type: Sequelize.STRING(255), allowNull: true },
			ip: { type: Sequelize.STRING(64), allowNull: true },
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);

		await queryInterface.addIndex('refresh_tokens', ['user_id'], { name: 'refresh_tokens_user_id_idx' }).catch(() => {});
		await queryInterface.addIndex('refresh_tokens', ['family_id'], { name: 'refresh_tokens_family_id_idx' }).catch(() => {});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('refresh_tokens');
	},
};
