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
    const exam = await examService.getExamWithQuestionsAndAnswersByPublicId(publicId);
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exam details' });
  }
};


export const submitExamAttempt = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if(!userId) userId=null;
    await examService.submitExamAttempt(req.body,userId);
    res.status(201).json({ message: 'Exam submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Submit failed', error: err.message });
  }
};

export const getExamResult = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if(!userId) userId=null;
    const result = await examService.getExamResult(req.params.publicId, userId);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: 'Result not found' });
  }
};
