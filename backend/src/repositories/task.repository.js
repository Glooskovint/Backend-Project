const prisma = require('../utils/db');

const getAll = () => prisma.tarea.findMany();

const getById = (id) => prisma.tarea.findUnique({ where: { id } });

const getByProject = (proyecto_id) =>
    prisma.tarea.findMany({ where: { proyecto_id } });

const create = (data) => prisma.tarea.create({ data });

const update = (id, data) =>
    prisma.tarea.update({ where: { id }, data });

const remove = (id) => prisma.tarea.delete({ where: { id } });

module.exports = {
    getAll,
    getById,
    getByProject,
    create,
    update,
    remove,
};
