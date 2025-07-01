const { generateInviteToken } = require('../utils/token');
const prisma = require('../utils/db');

// Devuelve todos los proyectos para un usuario dado:
// - Proyectos donde el usuario es el propietario (ownerId)
// - Proyectos donde el usuario es miembro (a través de MiembroProyecto)
exports.getAll = async (userId) => {
    if (!userId) {
        return []; // O manejar como un error, según la lógica de negocio
    }

    const proyectos = await prisma.proyecto.findMany({
        where: {
            OR: [
                { ownerId: userId }, // Proyectos propios
                { miembros: { some: { usuarioId: userId } } } // Proyectos donde es miembro
            ]
        },
        include: {
            owner: { // Incluir detalles del propietario
                select: {
                    firebase_uid: true,
                    nombre: true,
                    email: true
                }
            },
            miembros: { // Opcional: si necesitas info de miembros en la lista general
                include: {
                    usuario: {
                        select: {
                            firebase_uid: true,
                            nombre: true,
                            email: true
                        }
                    }
                }
            }
            // No incluimos 'objectives' aquí para mantener la carga ligera,
            // se cargarán al ver un proyecto específico.
        },
        orderBy: {
            fecha_inicio: 'desc' // Opcional: ordenar los proyectos
        }
    });
    return proyectos;
};

exports.getById = async (id) => {
    return await prisma.proyecto.findUnique({
        where: { id },
        include: {
            objectives: true, // Incluir objetivos específicos
        }
    });
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