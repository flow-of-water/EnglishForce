'use strict';

/**
 * Drops all duplicate non-constraint indexes across all tables.
 * Keeps exactly one index per (table, column set) combination.
 *
 * Duplicate indexes were created by repeated sequelize.sync({ alter: true })
 * calls — each startup added another index with an auto-incremented name.
 *
 * NOTE: Constraint-backed indexes (PRIMARY KEY, UNIQUE) were already handled
 * by migrations 000002 and 000003. This migration targets regular indexes only.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
	async up(queryInterface) {
		const [duplicates] = await queryInterface.sequelize.query(
			`
      SELECT tablename, indexname
      FROM (
        SELECT
          tablename,
          indexname,
          ROW_NUMBER() OVER (
            PARTITION BY tablename,
              regexp_replace(indexdef, 'INDEX \\S+ ON', 'INDEX _x_ ON')
            ORDER BY indexname
          ) AS rn
        FROM pg_indexes
        WHERE schemaname = 'public'
          -- skip indexes that back a PRIMARY KEY or UNIQUE constraint
          -- (those were handled by previous migrations)
          AND indexname NOT IN (
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
          )
      ) sub
      WHERE rn > 1
      ORDER BY tablename, indexname
      `,
			{ transaction: null }
		);

		console.log(`Found ${duplicates.length} duplicate indexes to drop.`);

		for (const { indexname } of duplicates) {
			await queryInterface.sequelize.query(
				`DROP INDEX IF EXISTS public."${indexname}"`,
				{ transaction: null }
			);
		}

		console.log('Done.');
	},

	async down() {},
};
