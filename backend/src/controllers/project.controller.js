const projectService = require('../services/project.service');

exports.getAll = async (req, res) => {
    try {
        const { ownerId } = req.query;
        const proyectos = await projectService.getAll(ownerId);
        res.json(proyectos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const proyecto = await projectService.getById(parseInt(req.params.id));
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.json(proyecto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

exports.create = async (req, res) => {
    try {
        const data = req.body;
        const proyecto = await projectService.create(data);
        res.json(proyecto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
};

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const proyecto = await projectService.update(id, req.body);
        res.json(proyecto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }
};

exports.getTareasByProyectoId = async (req, res) => {
    try {
        const tareas = await projectService.getTareasByProyectoId(parseInt(req.params.id));
        res.json(tareas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};
