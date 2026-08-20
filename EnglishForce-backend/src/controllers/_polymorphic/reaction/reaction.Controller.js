import * as reactionService from '../../../services/_polymorphic/reaction/reaction.service.js';

export const getReactionsByTypeAndId = async (req, res) => {
	try {
		const { type, id } = req.params;
		const reactions = await reactionService.getReactionsByTypeAndId(type, id);
		res.json(reactions);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getReactionByUserAndTypeAndId = async (req, res) => {
	try {
		const { type, id } = req.params;
		const reaction = await reactionService.getReactionByUserAndTypeAndId(req.user.id, type, id);
		res.json(reaction);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getReactionNumberByReactableId = async (req, res) => {
	try {
		const { reactable_id, reaction_type } = req.params;
		const reactionCount = await reactionService.getReactionNumberByReactableId(reactable_id, reaction_type);
		res.json({ count: reactionCount });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getReactionNumberByReactableIds = async (req, res) => {
	try {
		const { reactable_ids, reaction_type } = req.body;
		const reactionCount = await reactionService.getReactionNumberByReactableIds(reactable_ids, reaction_type);
		res.json({ count: reactionCount });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const createReaction = async (req, res) => {
	try {
		const { reactable_type, reactable_id, reaction_type } = req.body;
		const newReaction = await reactionService.createReaction({
			user_id: req.user.id,
			reactable_type,
			reactable_id,
			reaction_type,
		});
		res.status(201).json(newReaction);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteReaction = async (req, res) => {
	try {
		const { reactable_type, reactable_id, type } = req.body;
		const reaction = await reactionService.deleteReaction(req.user.id, reactable_type, reactable_id);
		res.json(reaction);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
