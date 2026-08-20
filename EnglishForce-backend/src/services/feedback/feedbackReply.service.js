import db from '../../sequelize/models/index.js';
const { Feedback, FeedbackReply, User } = db;

export const getAllFeedbackReplies = async () => {
	const feedbacks = await Feedback.findAll({
		include: [FeedbackReply],
		order: [['created_at', 'ASC']],
	});
	return feedbacks;
};

export const createFeedbackReply = async (feedbackPublicId, userId, content) => {
	const feedback = await Feedback.findOne({ where: { public_id: feedbackPublicId } });
	if (!feedback) {
		throw new Error('Feedback not found');
	}
	const newReply = await FeedbackReply.create({
		feedback_id: feedback.id,
		user_id: userId,
		content,
	});
	const replyWithUser = await FeedbackReply.findOne({
		where: { id: newReply.id },
		include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
	});
	return replyWithUser;
};
