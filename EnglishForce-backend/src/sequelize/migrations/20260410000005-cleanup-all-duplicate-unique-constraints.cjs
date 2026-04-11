'use strict';

/**
 * Drops all duplicate UNIQUE constraints on ANY column across all tables,
 * keeping exactly one per (table, column) pair (the lexicographically first name).
 *
 * The previous migration only cleaned public_id. This one catches all other
 * columns that also had unique: true in the model (e.g. name, slug, username).
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
	async up(queryInterface) {
		const [duplicates] = await queryInterface.sequelize.query(
			`
      SELECT table_name, constraint_name, column_name
      FROM (
        SELECT
          tc.table_name,
          tc.constraint_name,
          kcu.column_name,
          ROW_NUMBER() OVER (
            PARTITION BY tc.table_name, kcu.column_name
            ORDER BY tc.constraint_name
          ) AS rn
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON  tc.constraint_name = kcu.constraint_name
          AND tc.table_schema    = kcu.table_schema
        WHERE tc.table_schema    = 'public'
          AND tc.constraint_type = 'UNIQUE'
      ) sub
      WHERE rn > 1
      ORDER BY table_name, column_name, constraint_name
      `,
			{ transaction: null }
		);

		console.log(`Found ${duplicates.length} duplicate constraints to drop.`);

		for (const { table_name, constraint_name } of duplicates) {
			await queryInterface.sequelize.query(
				`ALTER TABLE public."${table_name}" DROP CONSTRAINT "${constraint_name}"`,
				{ transaction: null }
			);
		}

		console.log('Done.');
	},

	async down() {},
};
