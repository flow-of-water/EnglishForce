export const CACHE_KEYS = {
	COURSE: {
		PREFIX: 'course:',
		ALL: 'courses:all',
		BY_ID: id => `course:${id}`,
	},

	EXAM: {
		PREFIX: 'exam:',
		ALL: 'exams:all',
		BY_ID: id => `exam:${id}`,
	},

	PROGRAM: {
		PREFIX: 'program:',
		ALL: 'programs:all',
		BY_ID: id => `program:${id}`,
	},

	USER: {
		PREFIX: 'user:',
		BY_ID: id => `user:${id}`,
	},
};
