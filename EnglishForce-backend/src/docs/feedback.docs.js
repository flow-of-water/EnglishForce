export const feedbackTags = [{ name: 'Feedback', description: 'User feedback and support tickets' }];

const feedbackSchema = { $ref: '#/components/schemas/Feedback' };
const thumbnailUpload = { type: 'object', properties: { content: { type: 'string' }, thumbnail: { type: 'string', format: 'binary' } } };

export const feedbackPaths = {
	'/api/feedbacks': {
		get: {
			summary: 'Get all feedbacks',
			tags: ['Feedback'],
			security: [{ cookieAuth: [] }],
			parameters: [
				{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
				{ in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
			],
			responses: {
				200: { description: 'List of feedbacks' },
				401: { description: 'Unauthorized' },
			},
		},
		post: {
			summary: 'Submit new feedback',
			tags: ['Feedback'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'multipart/form-data': {
						schema: { type: 'object', required: ['content'], properties: { content: { type: 'string' }, thumbnail: { type: 'string', format: 'binary' } } },
					},
				},
			},
			responses: {
				201: { description: 'Feedback created' },
				401: { description: 'Unauthorized' },
			},
		},
	},
	'/api/feedbacks/{id}': {
		get: {
			summary: 'Get feedback by ID',
			tags: ['Feedback'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
			responses: {
				200: { description: 'Feedback details', content: { 'application/json': { schema: feedbackSchema } } },
				404: { description: 'Not found' },
			},
		},
		put: {
			summary: 'Update feedback',
			tags: ['Feedback'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
			requestBody: { content: { 'multipart/form-data': { schema: thumbnailUpload } } },
			responses: { 200: { description: 'Feedback updated' } },
		},
	},
};
