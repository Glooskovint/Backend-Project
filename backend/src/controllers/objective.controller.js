const objectiveService = require('../services/objective.service');

exports.create = async (req, res) => {
  try {
    const objetivo = await objectiveService.create(req.body);
    res.status(201).json(objetivo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el objetivo' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const objetivos = await objectiveService.getAll();
    res.json(objetivos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener objetivos' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const objetivo = await objectiveService.update(parseInt(id), req.body);
    res.json(objetivo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el objetivo' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await objectiveService.delete(parseInt(id));
    res.json({ message: 'Objetivo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el objetivo' });
  }
};
