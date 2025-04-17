// controllers/exam.controller.js
import * as examService from '../../services/exam/exam.service.js';

export const getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

export const getExamDetailWithQuestions = async (req, res) => {
  try {
    const { publicId } = req.params;
    const exam = await examService.getExamWithQuestionsAndAnswers(publicId);
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exam details' });
  }
};
