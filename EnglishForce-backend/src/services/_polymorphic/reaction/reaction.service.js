import db from '../../../sequelize/models/index.js';
const { Reaction } = db;

export const getReactionsByTypeAndId = async (type, id) => {
    const reactions = await Reaction.findAll({
        where: {
            reactable_type: type,
            reactable_id: id,
        },
    });
    return reactions;
};

export const getReactionByUserAndTypeAndId = async (user_id, type, id) => {
    const reaction = await Reaction.findOne({
        where: {
            user_id,
            reactable_type: type,
            reactable_id: id
        }
    });
    return reaction;
};

export const getReactionNumberByReactableId = async (reactable_id, reaction_type) => {
    const reactionCount = await Reaction.count({
        where: {
            reactable_id,
            reaction_type
        }
    });
    return reactionCount;
};

export const getReactionNumberByReactableIds = async (reactable_ids, reaction_type) => {
    const reactionCount = await Reaction.count({
        where: {
            reactable_id: {
                [Op.in]: reactable_ids
            },
            reaction_type: reaction_type
        }
    });
    return reactionCount;
};

export const createReaction = async ({ user_id, reactable_type, reactable_id, reaction_type }) => {
    const newReaction = await Reaction.create({
        user_id,
        reactable_type,
        reactable_id,
        reaction_type
    });
    return newReaction;
};

export const deleteReaction = async (user_id, reactable_type, reactable_id) => {
    const reaction = await Reaction.findOne({
        where: {
            user_id,
            reactable_type,
            reactable_id
        }
    });
    if (reaction) {
        await reaction.destroy();
    }
    return reaction;
};