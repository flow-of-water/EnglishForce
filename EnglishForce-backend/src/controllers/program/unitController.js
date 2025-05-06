import * as unitService from '../../services/program/unit.service.js';

export const getAllUnits = async (req, res) => {
  try {
    const units = await unitService.getAllUnits();
    res.json(units);
  } catch (error) {
    console.error('❌ getAllUnits error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUnitByPublicId = async (req, res) => {
  try {
    const unit = await unitService.getUnitByPublicId(req.params.publicId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    res.json(unit);
  } catch (error) {
    console.error('❌ getUnitByPublicId error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUnitsByProgramPublicId = async (req, res) => {
  try {
    const units = await unitService.getUnitsByProgramPublicId(req.params.programPublicId);
    res.json(units);
  } catch (error) {
    console.error('❌ getUnitsByProgramPublicId error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUnit = async (req, res) => {
  const { publicUnitId } = req.params;
  const { name, description, order_index } = req.body;

  try {
    const updated = await unitService.updateUnit(publicUnitId, {
      name,
      description,
      order_index: Number(order_index) || 0,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.json({ message: 'Unit updated successfully' });
  } catch (err) {
    console.error('Error updating unit:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
