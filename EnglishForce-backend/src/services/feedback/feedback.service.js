import db from '../../sequelize/models/index.js';
const { Feedback, FeedbackReply, User } = db;

export const getAllFeedbacks = async () => {
	const feedbacks = await Feedback.findAll({
		attributes: {
			include: [
				[
					db.sequelize.literal(
						`(SELECT COUNT(*) FROM reactions WHERE reactions.reactable_type = 'feedback' AND reactions.reactable_id = "Feedback"."id")`
					),
					'reaction_count',
				],
			],
		},
		include: [
			{
				model: User,
				attributes: ['id', 'username', 'avatar'],
			},
			{
				model: FeedbackReply,
				attributes: ['id'],
			},
		],
		order: [['created_at', 'DESC']],
	});
	return feedbacks;
};

export const getFeedbackById = async publicId => {
	const feedback = await Feedback.findOne({
		where: { public_id: publicId },
		include: [
			{
				model: User,
				attributes: ['id', 'username', 'avatar'],
			},
			{
				model: FeedbackReply,
				include: [
					{
						model: User,
						attributes: ['id', 'username', 'avatar'],
					},
				],
			},
		],
		order: [[FeedbackReply, 'created_at', 'ASC']],
	});
	if (!feedback) {
		throw new Error('Feedback not found');
	}
	return feedback;
};

export const createFeedback = async (userId, title, content, thumbnail, thumbnail_public_id) => {
	const newFeedback = await Feedback.create({
		user_id: userId,
		title,
		content,
		thumbnail,
		thumbnail_public_id,
	});
	return newFeedback;
};

export const updateFeedback = async (feedbackId, { title, content, thumbnail, thumbnail_public_id, status }) => {
	const feedback = await Feedback.findOne({ where: { id: feedbackId } });
	if (!feedback) {
		throw new Error('Feedback not found');
	}
	const updates = {};
	if (title !== undefined) updates.title = title;
	if (content !== undefined) updates.content = content;
	if (thumbnail !== undefined) updates.thumbnail = thumbnail;
	if (thumbnail_public_id !== undefined) updates.thumbnail_public_id = thumbnail_public_id;
	if (status !== undefined) updates.status = status;
	await feedback.update(updates);
	return feedback;
};
