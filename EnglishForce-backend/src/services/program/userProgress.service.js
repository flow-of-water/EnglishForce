import db from "../../sequelize/models/index.js";

export const createProgressService = async ({ lessonPublicId, userId, score }) => {
  const lesson = await db.Lesson.findOne({
    where: { public_id: lessonPublicId }
  });

  if (!lesson) throw new Error('Lesson not found');

  await db.UserProgress.create({
    user_id: userId,
    lesson_id: lesson.id,
    score,
    completed_at: new Date()
  });
};
