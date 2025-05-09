import db from "../../sequelize/models/index.js";
const { Program, Unit } = db;

export const getPaginatedPrograms = async (page = 1) => {
    const limit = 6 ;
  const offset = (page - 1) * limit;

  const { count, rows } = await Program.findAndCountAll({
    offset,
    limit,
    order: [['order_index', 'ASC']]
  });

  return {
    programs: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

export const getProgramByPublicId = async (public_id) => {
  const program = await Program.findOne({
    where: { public_id },
    include: [{
      model: Unit,
      as: 'Units',
      order: [['order_index', 'ASC']]
    }]
  });

  return program;
};



export const deleteByPublicId = async (publicId) => {
  const program = await db.Program.findOne({ where: { public_id: publicId } });
  if (!program) {
    throw new Error('Program not found');
  }
  await program.destroy(); 
  // CASCADE will delete relational Units, Lessons 
};



export const createProgramService = async ({ name, description, order_index, thumbnail }) => {
  return await db.Program.create({
    name,
    description,
    order_index,
    thumbnail,
  });
};