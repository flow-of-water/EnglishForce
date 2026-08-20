export const aiTags = [{ name: 'AI', description: 'AI-powered features (writing check, chatbot, recommendations)' }];

export const aiPaths = {
	'/api/AI/generate': {
		post: {
			summary: 'Generate an AI text response',
			tags: ['AI'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['prompt'],
							properties: { prompt: { type: 'string', example: 'Explain the present perfect tense.' } },
						},
					},
				},
			},
			responses: { 200: { description: 'AI-generated text response' } },
		},
	},
	'/api/AI/generate2': {
		post: {
			summary: 'Generate an AI response with real-time web data',
			tags: ['AI'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { type: 'object', required: ['prompt'], properties: { prompt: { type: 'string' } } },
					},
				},
			},
			responses: { 200: { description: 'AI-generated response augmented with web data' } },
		},
	},
	'/api/AI/check-writing': {
		post: {
			summary: 'Check and score a piece of writing',
			tags: ['AI'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['text'],
							properties: { text: { type: 'string', example: 'The student have went to school.' } },
						},
					},
				},
			},
			responses: { 200: { description: 'Writing assessment result with score and feedback' } },
		},
	},
	'/api/AI/chatbot': {
		post: {
			summary: 'Chat with the English learning AI assistant',
			tags: ['AI'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['message'],
							properties: {
								message: { type: 'string', example: 'How do I use the past perfect?' },
								history: {
									type: 'array',
									description: 'Previous conversation turns',
									items: {
										type: 'object',
										properties: {
											role: { type: 'string', enum: ['user', 'model'] },
											parts: { type: 'string' },
										},
									},
								},
							},
						},
					},
				},
			},
			responses: { 200: { description: 'AI chatbot reply' } },
		},
	},
	'/api/AI/recommendations': {
		post: {
			summary: 'Get personalized course recommendations',
			tags: ['AI'],
			security: [],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: { interests: { type: 'array', items: { type: 'string' } } },
						},
					},
				},
			},
			responses: { 200: { description: 'Recommended courses' } },
		},
	},
	'/api/AI/recommendations-reload': {
		post: {
			summary: 'Reload the recommendation model (admin)',
			tags: ['AI'],
			security: [{ cookieAuth: [] }],
			responses: {
				200: { description: 'Model reloaded' },
				403: { description: 'Forbidden — admin only' },
			},
		},
	},
};
