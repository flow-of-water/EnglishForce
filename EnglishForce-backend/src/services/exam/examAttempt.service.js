import { Model } from 'sequelize';
import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt, User } = db;


export const getAllAttempts = async () => {
    const attempts = await ExamAttempt.findAll({
        include: [
            { model: User, attributes: ['username'] },
            { model: Exam, attributes: ['name', 'public_id'] }
        ],
    });
    return attempts;
}


export const getExamAttemptByUserId = async (publicId, userId, limit_number = 5) => {
    const exam = await Exam.findOne({ where: { public_id: publicId } });
    if (!exam) return null;

    const attempts = await ExamAttempt.findAll({
        where: {
            exam_id: exam.id,
            user_id: userId
        },
        limit: limit_number,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'score', 'start', 'end', 'created_at']
    });
    return attempts;
}