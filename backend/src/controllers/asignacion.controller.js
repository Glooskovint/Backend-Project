const asignacionService = require('../services/asignacion.service');

exports.create = async (req, res) => {
  try {
    const asignacion = await asignacionService.create(req.body);
    res.status(201).json(asignacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la asignación' });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const asignaciones = await asignacionService.getAll();
    res.json(asignaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las asignaciones' });
  }
};

exports.delete = async (req, res) => {
  const { tareaId, usuarioId } = req.params;

  try {
    await asignacionService.delete(parseInt(tareaId), usuarioId);
    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la asignación' });
  }
};
