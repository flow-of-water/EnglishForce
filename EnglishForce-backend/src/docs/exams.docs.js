export const examsTags = [{ name: 'Exams', description: 'Exam management and submission' }];

const examSchema = { $ref: '#/components/schemas/Exam' };
const publicIdParam = { in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } };

export const examsPaths = {
	'/api/exams': {
		get: {
			summary: 'Get all exams',
			tags: ['Exams'],
			security: [],
			responses: {
				200: {
					description: 'List of exams',
					content: { 'application/json': { schema: { type: 'array', items: examSchema } } },
				},
			},
		},
		post: {
			summary: 'Create a new exam (admin)',
			tags: ['Exams'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['title'],
							properties: {
								title: { type: 'string' },
								description: { type: 'string' },
								duration: { type: 'integer', description: 'Duration in minutes' },
							},
						},
					},
				},
			},
			responses: {
				201: { description: 'Exam created' },
				403: { description: 'Forbidden — admin only' },
			},
		},
	},
	'/api/exams/attempts': {
		post: {
			summary: 'Submit an exam attempt',
			tags: ['Exams'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['examPublicId', 'answers'],
							properties: {
								examPublicId: { type: 'string', format: 'uuid' },
								answers: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											questionId: { type: 'integer' },
											answerId: { type: 'integer' },
										},
									},
								},
							},
						},
					},
				},
			},
			responses: { 200: { description: 'Attempt submitted — returns score and attempt ID' } },
		},
	},
	'/api/exams/attempts/result/{attemptPublicId}': {
		get: {
			summary: 'Get the result of an exam attempt',
			tags: ['Exams'],
			security: [],
			parameters: [
				{ in: 'path', name: 'attemptPublicId', required: true, schema: { type: 'string', format: 'uuid' } },
			],
			responses: {
				200: { description: 'Exam attempt result with correct answers and score' },
				404: { description: 'Attempt not found' },
			},
		},
	},
	'/api/exams/{publicId}': {
		get: {
			summary: 'Get exam with full question hierarchy',
			tags: ['Exams'],
			security: [],
			parameters: [publicIdParam],
			responses: {
				200: { description: 'Exam with parts, questions, and answers' },
				404: { description: 'Exam not found' },
			},
		},
		put: {
			summary: 'Update an exam (admin)',
			tags: ['Exams'],
			security: [{ cookieAuth: [] }],
			parameters: [publicIdParam],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								title: { type: 'string' },
								description: { type: 'string' },
								duration: { type: 'integer' },
							},
						},
					},
				},
			},
			responses: { 200: { description: 'Exam updated' } },
		},
		delete: {
			summary: 'Delete an exam (admin)',
			tags: ['Exams'],
			security: [{ cookieAuth: [] }],
			parameters: [publicIdParam],
			responses: { 200: { description: 'Exam deleted' } },
		},
	},
	'/api/exams/{publicId}/short': {
		get: {
			summary: 'Get a brief exam summary (no questions)',
			tags: ['Exams'],
			security: [],
			parameters: [publicIdParam],
			responses: { 200: { description: 'Short exam info' } },
		},
	},
};
