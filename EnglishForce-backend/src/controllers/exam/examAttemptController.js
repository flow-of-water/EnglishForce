import * as examAttemptService from '../../services/exam/examAttempt.service.js';


export const getAllAttempts = async (req, res) => {
  try {
  
    const attempts = await examAttemptService.getAllAttempts() ;

    res.json(attempts);
  } catch (err) {
    console.error('Error fetching all exam attempts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getUserExamAttempts = async (req, res) => {
    try {
      const { publicId } = req.params;
      const userId = req.user.id;
      if(!userId || !publicId) res.status(400).json({message: "Not found UserId or examPublicId"});
    
      const attempts = await examAttemptService.getExamAttemptByUserId(publicId, userId);
  
      res.json(attempts);
    } catch (err) {
      console.error('Error fetching user exam attempts:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };