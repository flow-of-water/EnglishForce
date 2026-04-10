'use strict';

const OPTIONS = { ifNotExists: true };

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// ── 1. users ──────────────────────────────────────────────────────────
		await queryInterface.createTable('users', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			username: { type: Sequelize.TEXT, allowNull: false, unique: true },
			password: { type: Sequelize.TEXT, allowNull: false },
			email: { type: Sequelize.TEXT },
			role: { type: Sequelize.TEXT },
			stripe_customer_id: { type: Sequelize.TEXT },
			avatar: { type: Sequelize.TEXT },
			avatar_public_id: { type: Sequelize.TEXT },
		}, OPTIONS);

		// ── 2. courses ────────────────────────────────────────────────────────
		await queryInterface.createTable('courses', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			name: { type: Sequelize.TEXT, allowNull: false },
			instructor: { type: Sequelize.TEXT },
			description: { type: Sequelize.TEXT },
			thumbnail: { type: Sequelize.TEXT },
			thumbnail_public_id: { type: Sequelize.TEXT },
			price: { type: Sequelize.DECIMAL(10, 2) },
		}, OPTIONS);

		// ── 3. exams ──────────────────────────────────────────────────────────
		await queryInterface.createTable('exams', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			name: { type: Sequelize.TEXT, allowNull: false },
			description: { type: Sequelize.TEXT },
			duration: { type: Sequelize.INTEGER, allowNull: false },
			type: { type: Sequelize.ENUM('general', 'toeic'), defaultValue: 'general' },
		}, OPTIONS);

		// ── 4. programs ───────────────────────────────────────────────────────
		await queryInterface.createTable('programs', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			name: { type: Sequelize.TEXT, allowNull: false },
			description: { type: Sequelize.TEXT },
			thumbnail: { type: Sequelize.TEXT },
			thumbnail_public_id: { type: Sequelize.TEXT },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
		}, OPTIONS);

		// ── 5. blog_categories ────────────────────────────────────────────────
		await queryInterface.createTable('blog_categories', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			name: { type: Sequelize.TEXT, allowNull: false, unique: true },
			description: { type: Sequelize.TEXT },
			color: { type: Sequelize.STRING, defaultValue: '#007BFF' },
			allowed_roles: { type: Sequelize.TEXT, allowNull: true },
		}, OPTIONS);

		// ── 6. course_sections (FK: courses) ──────────────────────────────────
		await queryInterface.createTable('course_sections', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			name: { type: Sequelize.TEXT, allowNull: false },
			description: { type: Sequelize.TEXT },
			course_id: { type: Sequelize.INTEGER, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE' },
			video_link: { type: Sequelize.TEXT },
			video_public_id: { type: Sequelize.TEXT },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
		}, OPTIONS);

		// ── 7. user_courses (FK: users, courses) ──────────────────────────────
		await queryInterface.createTable('user_courses', {
			user_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			course_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE' },
			rating: { type: Sequelize.INTEGER },
			comment: { type: Sequelize.TEXT },
			notes: { type: Sequelize.TEXT },
		}, OPTIONS);

		// ── 8. comments (FK: users, courses, self) ────────────────────────────
		await queryInterface.createTable('comments', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			course_id: { type: Sequelize.INTEGER, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE' },
			parent_comment_id: { type: Sequelize.INTEGER, references: { model: 'comments', key: 'id' }, onDelete: 'CASCADE' },
			content: { type: Sequelize.TEXT, allowNull: false },
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);

		// ── 9. interactions (FK: users, courses) ──────────────────────────────
		await queryInterface.createTable('interactions', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			course_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE' },
			score: { type: Sequelize.FLOAT, allowNull: false },
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);

		// ── 10. exam_attempts (FK: users, exams) ──────────────────────────────
		await queryInterface.createTable('exam_attempts', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			exam_id: { type: Sequelize.INTEGER, references: { model: 'exams', key: 'id' }, onDelete: 'CASCADE' },
			start: { type: Sequelize.DATE, allowNull: false },
			end: { type: Sequelize.DATE, allowNull: false },
			score: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
			description: { type: Sequelize.TEXT },
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);

		// ── 11. exam_parts (FK: exams; self-ref: parent_part_id) ─────────────
		await queryInterface.createTable('exam_parts', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			exam_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'exams', key: 'id' }, onDelete: 'CASCADE' },
			name: { type: Sequelize.TEXT },
			description: { type: Sequelize.TEXT },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
			thumbnail: { type: Sequelize.TEXT },
			thumbnail_public_id: { type: Sequelize.TEXT },
			record: { type: Sequelize.TEXT },
			record_public_id: { type: Sequelize.TEXT },
			parent_part_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'exam_parts', key: 'id' }, onDelete: 'SET NULL' },
		}, OPTIONS);

		// ── 12. questions (FK: exams, exam_parts) ─────────────────────────────
		await queryInterface.createTable('questions', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			exam_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'exams', key: 'id' }, onDelete: 'CASCADE' },
			exam_part_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'exam_parts', key: 'id' }, onDelete: 'CASCADE' },
			content: { type: Sequelize.TEXT },
			thumbnail: { type: Sequelize.TEXT },
			record: { type: Sequelize.TEXT },
			type: { type: Sequelize.ENUM('single_choice', 'multiple_choice', 'listening', 'reading'), defaultValue: 'single_choice' },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
		}, OPTIONS);

		// ── 13. answers (FK: questions) ───────────────────────────────────────
		await queryInterface.createTable('answers', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'questions', key: 'id' }, onDelete: 'CASCADE' },
			content: { type: Sequelize.TEXT, allowNull: false },
			is_correct: { type: Sequelize.BOOLEAN, defaultValue: false },
		}, OPTIONS);

		// ── 14. units (FK: programs) ──────────────────────────────────────────
		await queryInterface.createTable('units', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			program_id: { type: Sequelize.INTEGER, references: { model: 'programs', key: 'id' }, onDelete: 'CASCADE' },
			name: { type: Sequelize.TEXT, allowNull: false },
			description: { type: Sequelize.TEXT },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
		}, OPTIONS);

		// ── 15. lessons (FK: units) ───────────────────────────────────────────
		await queryInterface.createTable('lessons', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			unit_id: { type: Sequelize.INTEGER, references: { model: 'units', key: 'id' }, onDelete: 'CASCADE' },
			name: { type: Sequelize.TEXT, allowNull: false },
			description: { type: Sequelize.TEXT },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
		}, OPTIONS);

		// ── 16. exercises (FK: lessons) ───────────────────────────────────────
		await queryInterface.createTable('exercises', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			lesson_id: { type: Sequelize.INTEGER, references: { model: 'lessons', key: 'id' }, onDelete: 'CASCADE' },
			question: { type: Sequelize.TEXT, allowNull: false },
			type: { type: Sequelize.ENUM('single_choice', 'speaking', 'writing'), defaultValue: 'single_choice' },
			thumbnail: { type: Sequelize.TEXT },
			record: { type: Sequelize.TEXT },
			order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
			explanation: { type: Sequelize.TEXT },
		}, OPTIONS);

		// ── 17. exercise_answers (FK: exercises) ──────────────────────────────
		await queryInterface.createTable('exercise_answers', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			exercise_id: { type: Sequelize.INTEGER, references: { model: 'exercises', key: 'id' }, onDelete: 'CASCADE' },
			content: { type: Sequelize.TEXT, allowNull: false },
			is_correct: { type: Sequelize.BOOLEAN, defaultValue: false },
		}, OPTIONS);

		// ── 18. user_progresses (FK: users, lessons, programs) ────────────────
		await queryInterface.createTable('user_progresses', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			lesson_id: { type: Sequelize.INTEGER, references: { model: 'lessons', key: 'id' }, onDelete: 'CASCADE' },
			program_id: { type: Sequelize.INTEGER, references: { model: 'programs', key: 'id' }, onDelete: 'CASCADE' },
			completed_at: { type: Sequelize.DATE },
			score: { type: Sequelize.DECIMAL(5, 2) },
		}, OPTIONS);

		// ── 19. blogs (FK: users) ─────────────────────────────────────────────
		await queryInterface.createTable('blogs', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			name: { type: Sequelize.TEXT, allowNull: false },
			description: { type: Sequelize.TEXT },
			content: { type: Sequelize.TEXT },
			slug: { type: Sequelize.TEXT, allowNull: false, unique: true },
			thumbnail: { type: Sequelize.TEXT },
			thumbnail_public_id: { type: Sequelize.TEXT },
			created_at: { type: Sequelize.DATE },
			updated_at: { type: Sequelize.DATE },
		}, OPTIONS);

		// ── 20. blog_blog_categories (FK: blogs, blog_categories) ─────────────
		await queryInterface.createTable('blog_blog_categories', {
			blog_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'blogs', key: 'id' }, onDelete: 'CASCADE' },
			blog_category_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'blog_categories', key: 'id' }, onDelete: 'CASCADE' },
		}, OPTIONS);

		// ── 21. reactions (FK: users) ─────────────────────────────────────────
		await queryInterface.createTable('reactions', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
			reactable_type: { type: Sequelize.ENUM('course', 'comment', 'blog'), allowNull: false },
			reactable_id: { type: Sequelize.INTEGER, allowNull: false },
			reaction_type: { type: Sequelize.ENUM('like', 'love', 'helpful', 'insightful'), allowNull: false },
			created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
		}, OPTIONS);

		await queryInterface.addIndex('reactions', ['user_id', 'reactable_type', 'reactable_id'], { unique: true, name: 'reactions_user_reactable_unique' }).catch(() => {});
		await queryInterface.addIndex('reactions', ['reactable_type', 'reactable_id'], { name: 'reactions_reactable_idx' }).catch(() => {});

		// ── 22. otp_codes (FK: users) ─────────────────────────────────────────
		await queryInterface.createTable('otp_codes', {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			public_id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), unique: true },
			user_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
			email: { type: Sequelize.STRING, allowNull: false },
			purpose: { type: Sequelize.ENUM('login', 'signup', 'reset_password', 'verify_email'), allowNull: false, defaultValue: 'login' },
			code_hash: { type: Sequelize.STRING, allowNull: false },
			expires_at: { type: Sequelize.DATE, allowNull: false },
			attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
			consumed_at: { type: Sequelize.DATE, allowNull: true },
			last_sent_at: { type: Sequelize.DATE, allowNull: false },
			created_at: { type: Sequelize.DATE },
			updated_at: { type: Sequelize.DATE },
		}, OPTIONS);
	},

	async down(queryInterface) {
		// Drop in reverse dependency order
		await queryInterface.dropTable('otp_codes');
		await queryInterface.dropTable('reactions');
		await queryInterface.dropTable('blog_blog_categories');
		await queryInterface.dropTable('blogs');
		await queryInterface.dropTable('user_progresses');
		await queryInterface.dropTable('exercise_answers');
		await queryInterface.dropTable('exercises');
		await queryInterface.dropTable('lessons');
		await queryInterface.dropTable('units');
		await queryInterface.dropTable('answers');
		await queryInterface.dropTable('questions');
		await queryInterface.dropTable('exam_parts');
		await queryInterface.dropTable('exam_attempts');
		await queryInterface.dropTable('interactions');
		await queryInterface.dropTable('comments');
		await queryInterface.dropTable('user_courses');
		await queryInterface.dropTable('course_sections');
		await queryInterface.dropTable('blog_categories');
		await queryInterface.dropTable('programs');
		await queryInterface.dropTable('exams');
		await queryInterface.dropTable('courses');
		await queryInterface.dropTable('users');

		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_otp_codes_purpose"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reactions_reaction_type"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reactions_reactable_type"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_exercises_type"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_questions_type"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_exams_type"');
	},
};
