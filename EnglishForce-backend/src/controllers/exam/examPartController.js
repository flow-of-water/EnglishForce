import * as examPartService from '../../services/exam/examPart.service.js';


export const createExamPart = async (req, res) => {
  try {
    const { exam_public_id, name, description, parent_part_public_id } = req.body;

    if (!exam_public_id || !name) {
      return res.status(400).json({ error: 'exam_public_id and name are required' });
    }

    const part = await examPartService.createExamPart({
      exam_public_id,
      name,
      description,
      parent_part_public_id
    });

    res.status(201).json(part);
  } catch (error) {
    console.error('Error creating exam part:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getExamPartByPublicId = async (req, res) => {
  try {
    const part = await examPartService.getExamPartByPublicId(req.params.publicId);
    res.json(part);
  } catch (error) {
    console.error('Error fetching exam part:', error);
    res.status(404).json({ error: error.message });
  }
};

export const updateExamPart = async (req, res) => {
  try {
    const part = await examPartService.updateExamPart(req.params.publicId, req.body);
    res.json(part);
  } catch (error) {
    console.error('Error updating exam part:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteExamPart = async (req, res) => {
  try {
    await examPartService.deleteExamPart(req.params.publicId);
    res.json({ message: 'Exam Part deleted successfully.' });
  } catch (error) {
    console.error('Error deleting exam part:', error);
    res.status(500).json({ error: error.message });
  }
};

