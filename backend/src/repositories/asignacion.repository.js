const { prisma } = require('../utils/db');

const crearAsignacion = (data) =>
    prisma.asignacionTarea.create({ data });

const listarAsignaciones = () =>
    prisma.asignacionTarea.findMany({ include: { usuario: true, tarea: true } });

module.exports = {
    crearAsignacion,
    listarAsignaciones,
};
