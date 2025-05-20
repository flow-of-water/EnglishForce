// controllers/exam.controller.js
import * as examService from '../../services/exam/exam.service.js';

export const getAllExams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const exams = await examService.getAllExams(page);
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

export const getExamWithFullHierarchy = async (req, res) => {
  try {
    const { publicId } = req.params;
    const exam = await examService.getExamWithFullHierarchy(publicId);
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exam details' });
  }
};

export const getExamShortly = async (req, res) => {
  try {
    const { publicId } = req.params;
    const examShort = await examService.getExamShort(publicId);
    if (!examShort) return res.status(404).json({ error: 'Exam not found' });
    res.status(200).json(examShort);
  } catch (err) {
    console.error('Error fetching short exam info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExam = async (req, res) => {
  try {
    const { name, description, duration } = req.body;

    if (!name || !duration) {
      return res.status(400).json({ message: 'Name and duration are required' });
    }

    const exam = await examService.createExam({ name, description, duration });
    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateExam = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { name, description, duration } = req.body;

    const updatedExam = await examService.updateExamByPublicId(publicId, {
      name,
      description,
      duration
    });

    res.json({
      message: 'Exam updated successfully',
      exam: updatedExam
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};


export const deleteExam = async (req, res) => {
  try {
    const { publicId } = req.params;
    await examService.deleteExamByPublicId(publicId);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const submitExamAttempt = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if(!userId) userId=null;
    const attemptPublicId = await examService.submitExamAttempt(req.body,userId);
    res.status(201).json({ attemptPublicId: attemptPublicId });
  } catch (err) {
    res.status(500).json({ message: 'Submit failed', error: err.message });
  }
};

export const getExamResult = async (req, res) => {
  try {
    const attemptPublicId = req.params.attemptPublicId;
    const result = await examService.getExamResult(attemptPublicId);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: 'Result not found' });
  }
};
