import * as feedbackReplyService from '../../services/feedback/feedbackReply.service.js';

export const getAllFeedbackReplies = async (req, res) => {
	try {
		const feedbackReplies = await feedbackReplyService.getAllFeedbackReplies();
		res.json(feedbackReplies);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const createFeedbackReply = async (req, res) => {
	try {
		const { feedbackId } = req.params;
		const userId = req.user.id;
		const { content } = req.body;
		const newReply = await feedbackReplyService.createFeedbackReply(feedbackId, userId, content);
		res.status(201).json(newReply);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
