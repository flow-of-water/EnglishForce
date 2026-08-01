'use strict';

module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.query(
			`ALTER TYPE "enum_reactions_reactable_type" ADD VALUE IF NOT EXISTS 'feedback'`
		);
	},

	async down() {
		// PostgreSQL does not support removing a value from an existing ENUM type.
		// Rolling back requires manual intervention.
	},
};
