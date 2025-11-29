// services/exam.service.js
import db from '../../sequelize/models/index.js';
import { Op } from 'sequelize';
const { Exam, Question, Answer, ExamAttempt, ExamPart, QuestionGroup } = db;
import { cacheWrapper } from '../../utils/cache.helper.js';
import { CACHE_KEYS, API_MESSAGES } from '../../constants/index.js';

export const getNumberOfExams = async () => {
	return await db.Exam.count();
};

export const findExamIdByPublicId = async publicId => {
	const exam = await Exam.findOne({ where: { public_id: publicId } });
	if (!exam) throw new Error(API_MESSAGES.EXAM.NOT_FOUND);
	return exam.id;
};

export const getAllExams = async (page = 1, query = '') => {
	const pageSize = 6;
	const offset = (page - 1) * pageSize;

	const cacheKey = `${CACHE_KEYS.EXAM.ALL}:${query}:${page}`;
	const whereClause = query
		? {
				name: {
					[Op.iLike]: `%${query}%`, // PostgreSQL: không phân biệt hoa thường
				},
			}
		: {};

	return await cacheWrapper.read(cacheKey, async () => {
		const { count, rows } = await Exam.findAndCountAll({
			where: whereClause,
			attributes: ['public_id', 'name', 'description', 'duration', 'type'],
			limit: pageSize,
			offset: offset,
			order: [['id', 'DESC']],
		});

		return {
			totalItems: count,
			totalPages: Math.ceil(count / pageSize),
			currentPage: page,
			exams: rows,
		};
	});
};

// Lấy tất cả cây phân cấp của exam
function buildNestedParts(part, partMap) {
	part.Children = part.Children.map(childId => {
		const childPart = partMap[childId];
		return childPart ? buildNestedParts(childPart, partMap) : null;
	}).filter(Boolean);
	return part;
}
export const getExamWithFullHierarchy = async (publicId, onlyCorrectAnswers = false) => {
	const cacheKey = `${CACHE_KEYS.EXAM.BY_ID(publicId)}:${onlyCorrectAnswers ? 'correct' : 'all'}`;

	return await cacheWrapper.read(cacheKey, async () => {
		const exam = await db.Exam.findOne({
			where: { public_id: publicId },
			attributes: ['id', 'public_id', 'name', 'description', 'duration', 'type'],
		});

		if (!exam) throw new Error('Exam not found');

		// Step 1: Lấy tất cả các ExamParts của bài thi
		const allParts = await db.ExamPart.findAll({
			where: { exam_id: exam.id },
			order: [['order_index', 'ASC']],
			include: [
				{
					model: db.Question,
					attributes: ['id', 'public_id', 'content', 'type', 'thumbnail', 'record', 'order_index'],
					separate: true, // ⚠️ BẮT BUỘC nếu muốn order hoạt động
					order: [['order_index', 'ASC']],
					include: [
						{
							model: db.Answer,
							where: onlyCorrectAnswers ? { is_correct: true } : undefined,
							attributes: ['id', 'public_id', 'content', 'is_correct'],
							order: [['id', 'ASC']],
						},
					],
				},
			],
		});

		// Step 2: Convert về object thuần + chuẩn bị Map theo ID
		const partMap = {};
		allParts.forEach(part => {
			part = part.toJSON(); // make plain
			part.Children = [];
			partMap[part.id] = part;
		});

		// Step 3: Gắn part con vào cha (parent_part_id)
		// Ở đây CHildren nên chỉ gắn part.id thay vì part , để tránh trường hợp ông bà nhận thg con , sau đó thg con nhận cháu
		// => ông bà không nhận cháu
		allParts.forEach(part => {
			if (part.parent_part_id) partMap[part.parent_part_id]?.Children.push(part.id);
		});

		var rootParts = [];
		allParts.forEach(part => {
			if (!part.parent_part_id) rootParts.push(partMap[part.id]);
		});
		rootParts = rootParts.map(root => buildNestedParts(root, partMap));

		return {
			public_id: exam.public_id,
			name: exam.name,
			description: exam.description,
			duration: exam.duration,
			type: exam.type,
			parts: rootParts,
		};
	});
};

// ______

export const getExamShort = async publicId => {
	const exam = await db.Exam.findOne({
		where: { public_id: publicId },
		attributes: ['public_id', 'name', 'description', 'duration', 'type'],
	});

	return exam ? exam.toJSON() : null;
};

export const createExam = async ({ name, description, duration, type }) => {
	return await cacheWrapper.create(async () => {
		const newExam = await Exam.create({
			name,
			description: description || null,
			duration,
			type,
		});
		return newExam;
	}, [CACHE_KEYS.EXAM.PREFIX]);
};

export const updateExamByPublicId = async (publicId, updates) => {
	return await cacheWrapper.update(async () => {
		const exam = await Exam.findOne({ where: { public_id: publicId } });

		if (!exam) {
			throw new Error(API_MESSAGES.EXAM.NOT_FOUND);
		}

		await exam.update(updates);
		return exam;
	}, [CACHE_KEYS.EXAM.PREFIX]);
};

export const deleteExamByPublicId = async publicId => {
	return await cacheWrapper.delete(async () => {
		const exam = await Exam.findOne({ where: { public_id: publicId } });
		if (!exam) throw new Error(API_MESSAGES.EXAM.NOT_FOUND);

		await exam.destroy(); // Sequelize cascade sẽ xóa các Question vì đã set `onDelete: CASCADE`
	}, [CACHE_KEYS.EXAM.PREFIX]);
};

/**
 * Tính điểm TOEIC chuẩn từ số câu đúng từng phần.
 * @param {number} correctListening - Số câu đúng phần Listening (0–100)
 * @param {number} correctReading - Số câu đúng phần Reading (0–100)
 * @returns {Object} - { listening_score, reading_score, total_score }
 */
const calculateToeicScore = (correctListening, correctReading) => {
	console.log(correctListening, correctReading);
	const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

	// Giả sử Linear Scale từ 5–495 như sau:
	const mapScore = correct => {
		correct = clamp(correct, 0, 100);
		if (correct === 0) return 5;
		else return Math.min(correct * 5, 495);
	};

	const listening_score = mapScore(correctListening);
	const reading_score = mapScore(correctReading);
	const total_score = listening_score + reading_score;

	return {
		listening_score,
		reading_score,
		total_score,
	};
};
// Truy ngược về phần gốc (Listening / Reading)
const findRootPartFast = async exam_id => {
	const parts = await db.ExamPart.findAll({
		where: { exam_id },
		attributes: ['id', 'name', 'parent_part_id'],
	});

	const partMap = new Map();
	for (const part of parts) {
		partMap.set(part.id, part);
	}

	const rootCache = new Map();

	const resolveRoot = part_id => {
		let current = partMap.get(part_id);
		while (current?.parent_part_id) {
			current = partMap.get(current.parent_part_id);
		}
		return current;
	};

	for (const [id] of partMap) {
		rootCache.set(id, resolveRoot(id));
	}

	return rootCache; // Map: exam_part_id → rootPart
};

export const submitExamAttempt = async (body, userId) => {
	const { exam_public_id, answers, start, end } = body;

	const exam = await db.Exam.findOne({ where: { public_id: exam_public_id } });
	if (!exam) throw new Error(API_MESSAGES.EXAM.NOT_FOUND);

	const allQuestions = await db.Question.findAll({
		where: { exam_id: exam.id },
		include: [db.Answer, db.ExamPart],
	});

	const total = allQuestions.length;
	const questionMap = new Map();
	for (const q of allQuestions) {
		questionMap.set(q.public_id, q);
	}

	const rootPartMap = await findRootPartFast(exam.id);

	let correct = 0;
	let correctListening = 0;
	let correctReading = 0;

	for (const { question_public_id, answer_ids } of answers) {
		const question = questionMap.get(question_public_id);
		if (!question) continue;

		const correctAnswers = question.Answers.filter(a => a.is_correct).map(a => a.public_id);
		const isCorrect = JSON.stringify(correctAnswers.sort()) === JSON.stringify(answer_ids.sort());

		if (isCorrect) correct++;

		if (!isCorrect || exam.type !== 'toeic') continue;

		const rootPart = rootPartMap.get(question.exam_part_id);
		const rootName = rootPart?.name?.toLowerCase() || '';

		if (rootName.includes('listening')) correctListening++;
		else if (rootName.includes('reading')) correctReading++;
	}

	const score = (correct / total) * 100;
	const now = new Date();
	let description;

	if (exam.type === 'toeic') {
		const { listening_score, reading_score, total_score } = calculateToeicScore(correctListening, correctReading);
		description = `TOEIC Total Score: ${total_score}, Listening: ${listening_score}, Reading: ${reading_score}`;
	}

	const startTime = start ? new Date(start) : new Date();
	const endTime = end ? new Date(end) : new Date();

	const attempt = await db.ExamAttempt.create({
		exam_id: exam.id,
		user_id: userId,
		start: startTime,
		end: endTime,
		score,
		description,
	});

	return attempt.public_id;
};

export const getExamResult = async attemptPublicId => {
	const attempt = await db.ExamAttempt.findOne({
		where: { public_id: attemptPublicId },
	});

	if (!attempt) throw new Error(API_MESSAGES.EXAM_ATTEMPT.NOT_FOUND);

	const exam = await db.Exam.findByPk(attempt.exam_id);
	if (!exam) throw new Error(API_MESSAGES.EXAM.NOT_FOUND);

	const examInfor = await getExamWithFullHierarchy(exam.public_id, true); // lấy đáp án đúng thôi

	return {
		...examInfor,
		examAttemptDescription: attempt.description,
		score: attempt.score,
		attemptDuration: Number(((new Date(attempt.end) - new Date(attempt.start)) / 60000).toFixed(2)),
	};
};
