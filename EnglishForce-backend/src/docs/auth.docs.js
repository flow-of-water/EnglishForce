export const authTags = [
	{ name: 'Auth', description: 'Authentication — register, login, logout, password management' },
	{ name: 'OTP', description: 'One-time password for email verification and password reset' },
];

export const authPaths = {
	'/api/auth/register': {
		post: {
			summary: 'Register a new user',
			tags: ['Auth'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['name', 'email', 'password'],
							properties: {
								name: { type: 'string', example: 'John Doe' },
								email: { type: 'string', format: 'email', example: 'john@example.com' },
								password: { type: 'string', minLength: 6, example: 'secret123' },
							},
						},
					},
				},
			},
			responses: {
				201: { description: 'User registered successfully' },
				400: { description: 'Validation error or email already taken', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
			},
		},
	},
	'/api/auth/login': {
		post: {
			summary: 'Log in and receive JWT tokens via cookies',
			tags: ['Auth'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['email', 'password'],
							properties: {
								email: { type: 'string', format: 'email', example: 'john@example.com' },
								password: { type: 'string', example: 'secret123' },
							},
						},
					},
				},
			},
			responses: {
				200: { description: 'Login successful — access & refresh tokens set in HTTP-only cookies' },
				401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
			},
		},
	},
	'/api/auth/logout': {
		post: {
			summary: 'Log out and clear auth cookies',
			tags: ['Auth'],
			responses: { 200: { description: 'Logged out successfully' } },
		},
	},
	'/api/auth/change-password': {
		patch: {
			summary: "Change the authenticated user's password",
			tags: ['Auth'],
			security: [{ cookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['currentPassword', 'newPassword'],
							properties: {
								currentPassword: { type: 'string' },
								newPassword: { type: 'string', minLength: 6 },
							},
						},
					},
				},
			},
			responses: {
				200: { description: 'Password changed successfully' },
				401: { description: 'Unauthorized or wrong current password' },
			},
		},
	},
	'/api/auth/reset-password': {
		post: {
			summary: 'Reset password using a reset token (sent via OTP flow)',
			tags: ['Auth'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['newPassword'],
							properties: {
								newPassword: { type: 'string', minLength: 6 },
							},
						},
					},
				},
			},
			responses: {
				200: { description: 'Password reset successfully' },
				401: { description: 'Invalid or expired reset token' },
			},
		},
	},
	'/api/auth/refresh-token': {
		post: {
			summary: 'Issue a new access token using the refresh token cookie',
			tags: ['Auth'],
			security: [],
			responses: {
				200: { description: 'New access token issued' },
				401: { description: 'Missing or invalid refresh token' },
			},
		},
	},
	'/api/otp/request': {
		post: {
			summary: "Request an OTP code sent to the user's email",
			tags: ['OTP'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['email'],
							properties: {
								email: { type: 'string', format: 'email', example: 'john@example.com' },
							},
						},
					},
				},
			},
			responses: {
				200: { description: 'OTP sent to the provided email' },
				429: { description: 'Too many requests' },
			},
		},
	},
	'/api/otp/verify': {
		post: {
			summary: 'Verify an OTP code',
			tags: ['OTP'],
			security: [],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['email', 'otp'],
							properties: {
								email: { type: 'string', format: 'email', example: 'john@example.com' },
								otp: { type: 'string', example: '123456' },
							},
						},
					},
				},
			},
			responses: {
				200: { description: 'OTP verified — returns a short-lived reset token' },
				400: { description: 'Invalid or expired OTP' },
			},
		},
	},
};
