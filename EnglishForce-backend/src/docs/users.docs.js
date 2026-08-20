export const usersTags = [{ name: 'Users', description: 'User profile and account management' }];

export const usersPaths = {
	'/api/users': {
		get: {
			summary: 'Get paginated list of users (admin)',
			tags: ['Users'],
			parameters: [
				{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
				{ in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
			],
			responses: {
				200: {
					description: 'Paginated user list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
									meta: { $ref: '#/components/schemas/PaginationMeta' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/users/profile': {
		get: {
			summary: "Get the authenticated user's profile",
			tags: ['Users'],
			security: [{ cookieAuth: [] }],
			responses: {
				200: {
					description: 'User profile',
					content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
				},
				401: { description: 'Unauthorized' },
			},
		},
	},
	'/api/users/me/email': {
		patch: {
			summary: "Update the authenticated user's email address",
			tags: ['Users'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['email'],
							properties: { email: { type: 'string', format: 'email', example: 'newemail@example.com' } },
						},
					},
				},
			},
			responses: {
				200: { description: 'Email updated' },
				400: { description: 'Invalid email or already in use' },
				401: { description: 'Unauthorized' },
			},
		},
	},
	'/api/users/avatar': {
		patch: {
			summary: "Upload or replace the authenticated user's avatar",
			tags: ['Users'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'multipart/form-data': {
						schema: { type: 'object', properties: { avatar: { type: 'string', format: 'binary' } } },
					},
				},
			},
			responses: {
				200: { description: 'Avatar updated — returns new avatar URL' },
				401: { description: 'Unauthorized' },
			},
		},
	},
	'/api/users/{publicId}': {
		patch: {
			summary: "Update a user's role (admin only)",
			tags: ['Users'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['role'],
							properties: { role: { type: 'string', enum: ['user', 'admin'] } },
						},
					},
				},
			},
			responses: {
				200: { description: 'Role updated' },
				403: { description: 'Forbidden — admin only' },
			},
		},
	},
};
