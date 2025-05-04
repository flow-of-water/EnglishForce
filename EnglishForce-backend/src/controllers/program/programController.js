import * as programService from '../../services/program/program.service.js';

export const getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await programService.getPaginatedPrograms(page);
    res.json(result);
  } catch (err) {
    console.error('Error fetching programs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProgramDetail = async (req, res) => {
  try {
    const { public_id } = req.params;
    const program = await programService.getProgramByPublicId(public_id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (err) {
    console.error('Error fetching program detail:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteProgramByPublicId = async (req, res) => {
  const { publicId } = req.params;
  try {
    await programService.deleteByPublicId(publicId);
    res.status(200).json({ message: 'Program deleted successfully.' });
  } catch (err) {
    console.error('Error deleting program:', err);
    res.status(500).json({ message: 'Failed to delete program.' });
  }
};

