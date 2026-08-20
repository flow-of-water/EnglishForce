export const coursesTags = [{ name: 'Courses', description: 'Course catalog and management' }];

const courseSchema = { $ref: '#/components/schemas/Course' };
const paginationMeta = { $ref: '#/components/schemas/PaginationMeta' };

export const coursesPaths = {
	'/api/courses/search': {
		get: {
			summary: 'Search courses by keyword',
			tags: ['Courses'],
			security: [],
			parameters: [
				{ in: 'query', name: 'q', schema: { type: 'string' }, description: 'Search keyword' },
				{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
				{ in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
			],
			responses: { 200: { description: 'Matching courses' } },
		},
	},
	'/api/courses/top-rated': {
		get: {
			summary: 'Get top-rated courses',
			tags: ['Courses'],
			security: [],
			responses: {
				200: {
					description: 'Top-rated courses',
					content: { 'application/json': { schema: { type: 'array', items: courseSchema } } },
				},
			},
		},
	},
	'/api/courses': {
		get: {
			summary: 'Get paginated course list',
			tags: ['Courses'],
			security: [],
			parameters: [
				{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
				{ in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
			],
			responses: { 200: { description: 'Paginated courses' } },
		},
		post: {
			summary: 'Create a new course (admin)',
			tags: ['Courses'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'multipart/form-data': {
						schema: {
							type: 'object',
							required: ['title', 'description', 'price'],
							properties: {
								title: { type: 'string' },
								description: { type: 'string' },
								price: { type: 'number' },
								thumbnail: { type: 'string', format: 'binary' },
							},
						},
					},
				},
			},
			responses: {
				201: { description: 'Course created' },
				403: { description: 'Forbidden — admin only' },
			},
		},
	},
	'/api/courses/{publicId}': {
		get: {
			summary: 'Get course details by ID',
			tags: ['Courses'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			responses: {
				200: { description: 'Course details', content: { 'application/json': { schema: courseSchema } } },
				404: { description: 'Course not found' },
			},
		},
		put: {
			summary: 'Update a course (admin)',
			tags: ['Courses'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			requestBody: {
				content: {
					'multipart/form-data': {
						schema: {
							type: 'object',
							properties: {
								title: { type: 'string' },
								description: { type: 'string' },
								price: { type: 'number' },
								thumbnail: { type: 'string', format: 'binary' },
							},
						},
					},
				},
			},
			responses: {
				200: { description: 'Course updated' },
				403: { description: 'Forbidden — admin only' },
			},
		},
		delete: {
			summary: 'Delete a course (admin)',
			tags: ['Courses'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			responses: {
				200: { description: 'Course deleted' },
				403: { description: 'Forbidden — admin only' },
			},
		},
	},
};
