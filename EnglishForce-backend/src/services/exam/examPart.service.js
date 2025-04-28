import db from '../../sequelize/models/index.js';

export const createExamPart = async (data) => {
    const { exam_public_id, name, description, parent_part_public_id } = data;

    // Find Exam
    const exam = await db.Exam.findOne({ where: { public_id: exam_public_id } });
    if (!exam) throw new Error('Exam not found');

    // Find Parent Part 
    let parentPart = null;
    if (parent_part_public_id) {
        parentPart = await db.ExamPart.findOne({ where: { public_id: parent_part_public_id } });
        if (!parentPart) throw new Error('Parent Part not found');
    }

    // Create
    const part = await db.ExamPart.create({
        exam_id: exam.id,
        name,
        description,
        parent_part_id: parentPart ? parentPart.id : null
    });
    return part;
};

export const getExamPartByPublicId = async (publicId) => {
    const part = await db.ExamPart.findOne({
        where: { public_id: publicId },
        include: [
            { model: db.ExamPart, as: 'Children' },
            { model: db.ExamPart, as: 'Parent' },
            { model: db.Question },
        ]
    });
    if (!part) throw new Error('Exam Part not found');
    return part;
};

export const updateExamPart = async (publicId, updateData) => {
    const part = await db.ExamPart.findOne({ where: { public_id: publicId } });
    if (!part) throw new Error('Exam Part not found');

    await part.update(updateData);
    return part;
};

export const deleteExamPart = async (publicId) => {
    const part = await db.ExamPart.findOne({ where: { public_id: publicId } });
    if (!part) throw new Error('Exam Part not found');

    await part.destroy();
};