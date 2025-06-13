const TaskService = require('../services/task.service');

const getAll = async (req, res) => {
    try {
        const tareas = await TaskService.getAllTasks();
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const tarea = await TaskService.getTaskById(Number(req.params.id));
        if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByProject = async (req, res) => {
    try {
        const tareas = await TaskService.getTasksByProject(Number(req.params.pid));
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const nuevaTarea = await TaskService.createTask(req.body);
        res.status(201).json(nuevaTarea);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const tarea = await TaskService.updateTask(Number(req.params.id), req.body);
        res.json(tarea);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await TaskService.deleteTask(Number(req.params.id));
        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    getByProject,
    create,
    update,
    remove,
};
