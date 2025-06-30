const taskService = require('../services/task.service');

exports.getAll = async (req, res) => {
  try {
    const tareas = await taskService.getAll();
    res.json(tareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

exports.getByProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const tareas = await taskService.getByProject(projectId);
    res.json(tareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tareas del proyecto' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevaTarea = await taskService.create(req.body);
    res.json(nuevaTarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

exports.update = async (req, res) => {
  try {
    const tareaActualizada = await taskService.update(parseInt(req.params.id), req.body);
    res.json(tareaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await taskService.remove(id);
    if (eliminado) {
      res.json({ message: 'Tarea eliminada exitosamente' });
    } else {
      res.status(404).json({ error: 'Tarea no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
