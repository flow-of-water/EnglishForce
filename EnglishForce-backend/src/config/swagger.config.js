import { authTags, authPaths } from '../docs/auth.docs.js';
import { usersTags, usersPaths } from '../docs/users.docs.js';
import { coursesTags, coursesPaths } from '../docs/courses.docs.js';
import { blogsTags, blogsPaths } from '../docs/blogs.docs.js';
import { feedbackTags, feedbackPaths } from '../docs/feedback.docs.js';
import { examsTags, examsPaths } from '../docs/exams.docs.js';
import { aiTags, aiPaths } from '../docs/ai.docs.js';

export const swaggerSpec = {
	openapi: '3.0.0',
	info: {
		title: 'EnglishForce API',
		version: '1.0.0',
		description: 'REST API documentation for the EnglishForce language learning platform',
	},
	servers: [
		{
			url: `http://localhost:${process.env.PORT || 5000}`,
			description: 'Development server',
		},
	],
	components: {
		securitySchemes: {
			cookieAuth: {
				type: 'apiKey',
				in: 'cookie',
				name: 'accessToken',
				description: 'JWT access token stored in an HTTP-only cookie',
			},
		},
		schemas: {
			Error: {
				type: 'object',
				properties: { message: { type: 'string' } },
			},
			PaginationMeta: {
				type: 'object',
				properties: {
					page: { type: 'integer', example: 1 },
					limit: { type: 'integer', example: 10 },
					total: { type: 'integer', example: 100 },
					totalPages: { type: 'integer', example: 10 },
				},
			},
			User: {
				type: 'object',
				properties: {
					publicId: { type: 'string', format: 'uuid' },
					name: { type: 'string' },
					email: { type: 'string', format: 'email' },
					role: { type: 'string', enum: ['user', 'admin'] },
					avatar: { type: 'string', nullable: true },
					createdAt: { type: 'string', format: 'date-time' },
				},
			},
			Course: {
				type: 'object',
				properties: {
					publicId: { type: 'string', format: 'uuid' },
					title: { type: 'string' },
					description: { type: 'string' },
					thumbnail: { type: 'string', nullable: true },
					price: { type: 'number' },
					createdAt: { type: 'string', format: 'date-time' },
				},
			},
			Blog: {
				type: 'object',
				properties: {
					publicId: { type: 'string', format: 'uuid' },
					title: { type: 'string' },
					slug: { type: 'string' },
					content: { type: 'string' },
					thumbnail: { type: 'string', nullable: true },
					createdAt: { type: 'string', format: 'date-time' },
				},
			},
			Exam: {
				type: 'object',
				properties: {
					publicId: { type: 'string', format: 'uuid' },
					title: { type: 'string' },
					description: { type: 'string' },
					duration: { type: 'integer', description: 'Duration in minutes' },
					createdAt: { type: 'string', format: 'date-time' },
				},
			},
			Feedback: {
				type: 'object',
				properties: {
					id: { type: 'integer' },
					content: { type: 'string' },
					thumbnail: { type: 'string', nullable: true },
					createdAt: { type: 'string', format: 'date-time' },
				},
			},
		},
	},
	security: [{ cookieAuth: [] }],
	tags: [...authTags, ...usersTags, ...coursesTags, ...blogsTags, ...feedbackTags, ...examsTags, ...aiTags],
	paths: {
		...authPaths,
		...usersPaths,
		...coursesPaths,
		...blogsPaths,
		...feedbackPaths,
		...examsPaths,
		...aiPaths,
	},
};
