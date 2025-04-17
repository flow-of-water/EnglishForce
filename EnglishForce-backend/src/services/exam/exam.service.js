// services/exam.service.js
import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer } = db;
export const getAllExams = async () => {
  return await Exam.findAll({
    attributes: ['public_id', 'name', 'description', 'duration']
  });
};

export const getExamWithQuestionsAndAnswers = async (publicId) => {
  const exam = await Exam.findOne({
    where: { public_id: publicId },
    include: {
      model: Question,
      include: Answer
    }
  });

  if (!exam) throw new Error("Exam not found");

  return exam;
};
