import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt } = db;

export const getQuestionsNumBerByExam = async (id) => {
    const count = await Question.count({
        where: { exam_id: id }
    });
    return count;
};


export const getQuestionsByExamPublicId = async (examPublicId) => {
    const exam = await Exam.findOne({ where: { public_id: examPublicId } });
    if (!exam) throw new Error('Exam not found');

    return await Question.findAll({
        where: { exam_id: exam.id },
        order: [['id', 'ASC']]
    });
};

export const createQuestion = async (data) => {
    const { exam_public_id, content, type, thumbnail, record } = data;
    const exam = await Exam.findOne({ where: { public_id: exam_public_id } });
    if (!exam) throw new Error('Exam not found');

    return await Question.create({
        content,
        type,
        thumbnail: thumbnail || null,
        record: record || null,
        exam_id: exam.id
    });
};

export const deleteQuestion = async (publicId) => {
    const question = await Question.findOne({ where: { public_id: publicId } });
    if (!question) throw new Error('Question not found');
    await question.destroy();
};