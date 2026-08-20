export const blogsTags = [{ name: 'Blogs', description: 'Blog posts' }];

const blogSchema = { $ref: '#/components/schemas/Blog' };
const thumbnailUpload = {
	type: 'object',
	properties: {
		title: { type: 'string' },
		content: { type: 'string' },
		thumbnail: { type: 'string', format: 'binary' },
	},
};

export const blogsPaths = {
	'/api/blogs': {
		get: {
			summary: 'Get paginated blog posts',
			tags: ['Blogs'],
			security: [],
			parameters: [
				{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
				{ in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
			],
			responses: { 200: { description: 'Paginated blog list' } },
		},
		post: {
			summary: 'Create a new blog post',
			tags: ['Blogs'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['title', 'content'],
							properties: {
								title: { type: 'string' },
								content: { type: 'string' },
								categoryId: { type: 'integer' },
							},
						},
					},
				},
			},
			responses: {
				201: { description: 'Blog post created' },
				401: { description: 'Unauthorized' },
			},
		},
	},
	'/api/blogs/slug/{slug}': {
		get: {
			summary: 'Get a blog post by slug',
			tags: ['Blogs'],
			security: [],
			parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
			responses: {
				200: { description: 'Blog post', content: { 'application/json': { schema: blogSchema } } },
				404: { description: 'Not found' },
			},
		},
		put: {
			summary: 'Update a blog post by slug',
			tags: ['Blogs'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
			requestBody: { content: { 'multipart/form-data': { schema: thumbnailUpload } } },
			responses: { 200: { description: 'Blog post updated' } },
		},
	},
	'/api/blogs/{publicId}': {
		get: {
			summary: 'Get a blog post by public ID',
			tags: ['Blogs'],
			security: [],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			responses: {
				200: { description: 'Blog post', content: { 'application/json': { schema: blogSchema } } },
				404: { description: 'Not found' },
			},
		},
		put: {
			summary: 'Update a blog post by public ID',
			tags: ['Blogs'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			requestBody: { content: { 'multipart/form-data': { schema: thumbnailUpload } } },
			responses: { 200: { description: 'Blog post updated' } },
		},
		delete: {
			summary: 'Delete a blog post',
			tags: ['Blogs'],
			security: [{ cookieAuth: [] }],
			parameters: [{ in: 'path', name: 'publicId', required: true, schema: { type: 'string', format: 'uuid' } }],
			responses: { 200: { description: 'Blog post deleted' } },
		},
	},
};
