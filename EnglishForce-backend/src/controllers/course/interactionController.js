import * as interactionService from '../../services/interaction.service.js' ;

export const createInteraction = async (req, res) => {
  try {
    const interaction = await interactionService.createInteraction(req.body);
    res.status(201).json(interaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllInteractions = async (req, res) => {
  try {
    const interactions = await interactionService.getAllInteractions();
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInteractionById = async (req, res) => {
  try {
    const interaction = await interactionService.getInteractionByPublicId(req.params.publicId);
    res.json(interaction);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateInteraction = async (req, res) => {
  try {
    const updated = await interactionService.updateInteraction(req.params.publicId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInteraction = async (req, res) => {
  try {
    await interactionService.deleteInteraction(req.params.publicId);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
