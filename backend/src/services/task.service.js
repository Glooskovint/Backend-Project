const TaskRepo = require('../repositories/task.repository');

const getAllTasks = () => TaskRepo.getAll();

const getTaskById = (id) => TaskRepo.getById(id);

const getTasksByProject = (proyecto_id) => TaskRepo.getByProject(proyecto_id);

const createTask = async (data) => {
    if (!data.proyecto_id || !data.titulo) {
        throw new Error('proyecto_id y título son obligatorios');
    }
    return await TaskRepo.create(data);
};

const updateTask = (id, data) => TaskRepo.update(id, data);

const deleteTask = (id) => TaskRepo.remove(id);

module.exports = {
    getAllTasks,
    getTaskById,
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
};
