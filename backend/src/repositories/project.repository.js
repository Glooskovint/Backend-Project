const prisma = require('../utils/db');

const getAll = () => prisma.proyecto.findMany();

const getById = (id) => prisma.proyecto.findUnique({ where: { id } });

const getByUser = (usuario_id) => prisma.proyecto.findMany({
    where: { usuario_id }
});

const create = (data) => prisma.proyecto.create({ data });

const update = (id, data) =>
    prisma.proyecto.update({ where: { id }, data });

const remove = (id) => prisma.proyecto.delete({ where: { id } });

module.exports = {
    getAll,
    getById,
    getByUser,
    create,
    update,
    remove
};
