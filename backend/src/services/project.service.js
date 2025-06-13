const prisma = require('../utils/db');

// Devuelve todos los proyectos, con filtro opcional por ownerId
exports.getAll = async (ownerId) => {
    return await prisma.proyecto.findMany({
        where: ownerId ? { ownerId } : undefined,
    });
};

exports.getById = async (id) => {
    return await prisma.proyecto.findUnique({ where: { id } });
};

exports.create = async (data) => {
    const {
        titulo,
        fecha_inicio,
        fecha_fin,
        descripcion = '',
        objetivo_general = '',
        ownerId = null,
    } = data;

    return await prisma.proyecto.create({
        data: {
            titulo,
            descripcion,
            objetivo_general,
            fecha_inicio: new Date(fecha_inicio),
            fecha_fin: new Date(fecha_fin),
            ownerId,
        },
    });
};

exports.update = async (id, data) => {
    return await prisma.proyecto.update({
        where: { id },
        data,
    });
};

exports.getTareasByProyectoId = async (proyectoId) => {
    const tareas = await prisma.tarea.findMany({
        where: { proyectoId },
        include: { subtareas: true, asignaciones: true },
    });

    return buildHierarchy(tareas);
};

// Función para construir jerarquía de tareas
function buildHierarchy(tareas) {
    const map = {};
    const roots = [];
    tareas.forEach(t => {
        map[t.id] = { ...t, subtareas: [] };
    });
    tareas.forEach(t => {
        if (!t.parentId) {
            roots.push(map[t.id]);
        } else if (map[t.parentId]) {
            map[t.parentId].subtareas.push(map[t.id]);
        }
    });
    return roots;
}
