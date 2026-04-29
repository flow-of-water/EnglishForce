import * as feedbackService from '../../services/feedback/feedback.service.js';

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();  
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await feedbackService.getFeedbackById(id);
        res.status(200).json(feedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        const thumbnail = req.file ? req.file.path : null;
        const thumbnail_public_id = req.file ? req.file.filename : null;
        const newFeedback = await feedbackService.createFeedback(userId, title, content, thumbnail, thumbnail_public_id);
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, status } = req.body;
        const thumbnail = req.file ? req.file.path : req.body.thumbnail;
        const thumbnail_public_id = req.file ? req.file.filename : req.body.thumbnail_public_id;
        const updatedFeedback = await feedbackService.updateFeedback(id, { title, content, thumbnail, thumbnail_public_id, status });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};