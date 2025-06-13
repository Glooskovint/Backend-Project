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

exports.getMiembros = async (req, res) => {
  try {
    const miembros = await projectService.getMiembros(parseInt(req.params.id));
    res.json(miembros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los miembros' });
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

exports.getInviteLink = async (req, res) => {
    try {
        const { id } = req.params;
        const token = await projectService.getOrCreateInviteToken(parseInt(id));
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el token de invitación' });
    }
};

exports.joinByInvite = async (req, res) => {
    try {
        const { token } = req.params;
        const { userId } = req.body;

        const proyecto = await projectService.joinUserByToken(token, userId);
        res.json({ mensaje: 'Unido con éxito', proyecto });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};
