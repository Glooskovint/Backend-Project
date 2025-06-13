const ProjectRepo = require('../repositories/project.repository');

const getAllProjects = () => ProjectRepo.getAll();

const getProjectById = (id) => ProjectRepo.getById(id);

const getProjectsByUser = (uid) => ProjectRepo.getByUser(uid);

const createProject = async (data) => {
    if (!data.usuario_id || !data.nombre) {
        throw new Error('usuario_id y nombre son obligatorios');
    }
    return await ProjectRepo.create(data);
};

const updateProject = (id, data) => ProjectRepo.update(id, data);

const deleteProject = (id) => ProjectRepo.remove(id);

module.exports = {
    getAllProjects,
    getProjectById,
    getProjectsByUser,
    createProject,
    updateProject,
    deleteProject
};
