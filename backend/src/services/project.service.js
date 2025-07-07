const { generateInviteToken } = require('../utils/token');
const prisma = require('../utils/db');

// Devuelve todos los proyectos, con filtro opcional por ownerId
exports.getAll = async (ownerId) => {
    return await prisma.proyecto.findMany({
        where: ownerId ? { ownerId } : undefined,
        include: {
            owner: {
                select: {
                    nombre: true
                }
            }
        }
    });
};

exports.getById = async (id) => {
    return await prisma.proyecto.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    nombre: true
                }
            }
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

    const newProject = await prisma.proyecto.create({
        data: {
            titulo,
            descripcion,
            objetivo_general,
            fecha_inicio: new Date(fecha_inicio),
            fecha_fin: new Date(fecha_fin),
            ownerId,
        },
    });

    // Automatically add the owner as a member of the project
    if (newProject && ownerId) {
        await prisma.miembroProyecto.create({
            data: {
                proyectoId: newProject.id,
                usuarioId: ownerId,
                rol: 'owner', // Or 'admin', depending on your role structure
            },
        });
    }

    return newProject;
};

exports.update = async (id, data) => {
    const { fecha_inicio, fecha_fin, ...restData } = data;
    const updateData = { ...restData };

    if (fecha_inicio) {
        updateData.fecha_inicio = new Date(fecha_inicio);
    }
    if (fecha_fin) {
        updateData.fecha_fin = new Date(fecha_fin);
    }

    return await prisma.proyecto.update({
        where: { id },
        data: updateData,
        include: { // Ensure owner is returned for consistency, as in getById
            owner: {
                select: {
                    nombre: true
                }
            }
        }
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

exports.getSharedProjects = async (userId) => { 
  return prisma.proyecto.findMany({
    where: {
      AND: [
        { ownerId: { not: userId } },
        { miembros: { some: { usuarioId: userId } } },
      ],
    },
    include: {
      owner: {
        select: {
          nombre: true
        }
      }
    }
  });
};

exports.remove = async (id) => {
  // Obtener todas las tareas del proyecto para luego eliminar sus asignaciones
  const tareasDelProyecto = await prisma.tarea.findMany({
    where: { proyectoId: id },
    select: { id: true } // Solo necesitamos los IDs
  });
  const tareaIds = tareasDelProyecto.map(t => t.id);

  // Eliminar AsignacionTarea relacionadas con las tareas del proyecto
  if (tareaIds.length > 0) {
    await prisma.asignacionTarea.deleteMany({
      where: { tareaId: { in: tareaIds } },
    });
  }

  // Luego, eliminar todas las tareas y objetivos asociados al proyecto.
  await prisma.tarea.deleteMany({
    where: { proyectoId: id },
  });
  // Corregir el nombre del modelo de Objetivo a ObjetivoEspecifico
  await prisma.objetivoEspecifico.deleteMany({
    where: { proyectoId: id },
  });
  // Luego, eliminar los miembros del proyecto.
  await prisma.miembroProyecto.deleteMany({
    where: { proyectoId: id },
  });
  // Finalmente, eliminar el proyecto.
  return await prisma.proyecto.delete({
    where: { id },
  });
};
