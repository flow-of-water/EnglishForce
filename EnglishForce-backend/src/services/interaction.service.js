import db from '../sequelize/models/index.js';
const { UserCourseInteraction, User, Course } = db;

export const createInteraction = async ({ user_id, course_id, score }) => {
  return await UserCourseInteraction.create({ user_id, course_id, score });
};

export const getAllInteractions = async () => {
  return await UserCourseInteraction.findAll({
    include: [{ model: User }, { model: Course }]
  });
};

export const getInteractionByPublicId = async (publicId) => {
  const interaction = await UserCourseInteraction.findOne({
    where: { public_id: publicId },
    include: [{ model: User }, { model: Course }]
  });
  if (!interaction) throw new Error('Interaction not found');
  return interaction;
};

export const updateInteraction = async (publicId, updateData) => {
  const interaction = await getInteractionByPublicId(publicId);
  return await interaction.update(updateData);
};

export const deleteInteraction = async (publicId) => {
  const interaction = await getInteractionByPublicId(publicId);
  return await interaction.destroy();
};
