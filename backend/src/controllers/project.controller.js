const ProjectService = require('../services/project.service');

const getAll = async (req, res) => {
    try {
        const proyectos = await ProjectService.getAllProjects();
        res.json(proyectos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const proyecto = await ProjectService.getProjectById(Number(req.params.id));
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.json(proyecto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByUser = async (req, res) => {
    try {
        const proyectos = await ProjectService.getProjectsByUser(req.params.uid);
        res.json(proyectos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const nuevoProyecto = await ProjectService.createProject(req.body);
        res.status(201).json(nuevoProyecto);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const proyecto = await ProjectService.updateProject(Number(req.params.id), req.body);
        res.json(proyecto);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await ProjectService.deleteProject(Number(req.params.id));
        res.json({ message: 'Proyecto eliminado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    getByUser,
    create,
    update,
    remove
};
