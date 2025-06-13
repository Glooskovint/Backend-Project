const { generateInviteToken } = require('../utils/token');
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

exports.getMiembros = async (proyectoId) => {
  return await prisma.miembroProyecto.findMany({
    where: { proyectoId },
    include: {
      usuario: true, // Incluye datos del usuario relacionado
    },
  });
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

exports.getOrCreateInviteToken = async (id) => {
    const proyecto = await prisma.proyecto.findUnique({ where: { id } });

    if (!proyecto) throw new Error('Proyecto no encontrado');

    if (proyecto.inviteToken) return proyecto.inviteToken;

    const newToken = generateInviteToken();

    await prisma.proyecto.update({
        where: { id },
        data: { inviteToken: newToken },
    });

    return newToken;
};

exports.joinUserByToken = async (token, userId) => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { inviteToken: token },
    });

    if (!proyecto) throw new Error('Token inválido o proyecto no encontrado');

    // Verificamos si ya está registrado
    const yaEsMiembro = await prisma.miembroProyecto.findFirst({
        where: {
            proyectoId: proyecto.id,
            usuarioId: userId,
        },
    });

    if (yaEsMiembro) throw new Error('Ya eres miembro de este proyecto');

    // Añadir nuevo miembro
    await prisma.miembroProyecto.create({
        data: {
            proyectoId: proyecto.id,
            usuarioId: userId,
            rol: 'miembro', // Asignar rol por defecto
        },
    });

    return proyecto;
};