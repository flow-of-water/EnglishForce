'use strict';

/**
 * Drops all duplicate UNIQUE constraints on `public_id` across all tables,
 * keeping exactly one per table (the lexicographically first constraint name).
 *
 * Each DROP runs in its own autocommit transaction ({ transaction: null }) to
 * avoid hitting PostgreSQL's max_locks_per_transaction limit when there are
 * thousands of duplicate constraints to remove.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
	async up(queryInterface) {
		const [duplicates] = await queryInterface.sequelize.query(
			`
      SELECT table_name, constraint_name
      FROM (
        SELECT
          tc.table_name,
          tc.constraint_name,
          ROW_NUMBER() OVER (
            PARTITION BY tc.table_name
            ORDER BY tc.constraint_name
          ) AS rn
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON  tc.constraint_name = kcu.constraint_name
          AND tc.table_schema    = kcu.table_schema
        WHERE tc.table_schema    = 'public'
          AND tc.constraint_type = 'UNIQUE'
          AND kcu.column_name    = 'public_id'
      ) sub
      WHERE rn > 1
      ORDER BY table_name, constraint_name
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

	// Cannot restore duplicate constraints — this migration is irreversible.
	async down() {},
};
