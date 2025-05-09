import db from "../../sequelize/models/index.js";
const { Unit, Lesson, Program } = db;

export const getAllUnits = async () => {
  return await Unit.findAll({
    include: [{ model: Lesson, order: [['order_index', 'ASC']] }],
    order: [['order_index', 'ASC']],
  });
};

export const getUnitByPublicId = async (publicId) => {
  return await Unit.findOne({
    where: { public_id: publicId },
    include: [
      {
        model: Lesson,
        order: [['order_index', 'ASC']],
      },
    ],
  });
};

export const getUnitsByProgramPublicId = async (programPublicId) => {
  const program = await Program.findOne({ where: { public_id: programPublicId } });
  if (!program) return [];

  return await Unit.findAll({
    where: { program_id: program.id },
    include: [{ model: Lesson }],
    order: [['order_index', 'ASC']],
  });
};


export const updateUnit = async (publicId, data) => {
  const unit = await db.Unit.findOne({ where: { public_id: publicId } });
  if (!unit) return null;

  await unit.update(data);
  return unit;
};

