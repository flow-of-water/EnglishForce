// src/constants/apiMessages.js

// Các message dùng chung cho toàn hệ thống
const COMMON_MESSAGES = {
	INTERNAL_SERVER_ERROR: 'Internal server error',
	BAD_REQUEST: 'Invalid request',
	UNAUTHORIZED: 'Unauthorized',
	FORBIDDEN: 'Forbidden',
	NOT_FOUND: 'Resource not found',
};

// Các message riêng cho module Exam
const EXAM_MESSAGES = {
	NOT_FOUND: 'Exam not found',

	CREATE_SUCCESS: 'Exam created successfully',
	CREATE_FAILED: 'Failed to create exam',

	UPDATE_SUCCESS: 'Exam updated successfully',
	UPDATE_FAILED: 'Failed to update exam',

	DELETE_SUCCESS: 'Exam deleted successfully',
	DELETE_FAILED: 'Failed to delete exam',
};

const ATTEMPT_MESSAGES = {
	NOT_FOUND: 'Exam attempt not found',

	CREATE_SUCCESS: 'Exam attempt submitted successfully',
	CREATE_FAILED: 'Failed to submit exam attempt',

	ALREADY_SUBMITTED: 'Exam has already been submitted',
	INVALID_PAYLOAD: 'Invalid exam attempt payload',
};

// gom cho dễ import 1 lần
export const API_MESSAGES = {
	COMMON: COMMON_MESSAGES,
	EXAM: EXAM_MESSAGES,
	EXAM_ATTEMPT: ATTEMPT_MESSAGES,
};
