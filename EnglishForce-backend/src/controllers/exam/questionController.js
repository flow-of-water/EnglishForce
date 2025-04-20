import * as questionService from '../../services/exam/question.service.js';
  
  export const getQuestionsByExam = async (req, res) => {
    try {
      const { publicId } = req.params;
      const questions = await questionService.getQuestionsByExamPublicId(publicId);
      res.json(questions);
    } catch (error) {
      console.error('Error getting questions:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  export const createQuestion = async (req, res) => {
    try {
      const question = await questionService.createQuestion(req.body);
      res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteQuestion = async (req, res) => {
    try {
      await questionService.deleteQuestion(req.params.publicId);
      res.json({ message: 'Question deleted' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: error.message });
    }
  };
  