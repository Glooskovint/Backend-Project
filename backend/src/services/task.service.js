const prisma = require('../utils/db');

exports.getAll = async () => {
  return await prisma.tarea.findMany();
};

exports.create = async (data) => {
  const {
    proyectoId,
    parentId,
    nombre,
    fecha_inicio,
    fecha_fin,
    presupuesto,
  } = data;

  return await prisma.tarea.create({
    data: {
      proyectoId: parseInt(proyectoId),
      parentId: parentId ? parseInt(parentId) : null,
      nombre,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      presupuesto: parseFloat(presupuesto) || 0,
      metadata: {},
    },
    include: {
      subtareas: true,
    },
  });
};

exports.update = async (id, data) => {
  const {
    nombre,
    fecha_inicio,
    fecha_fin,
    presupuesto,
    parentId,
    metadata,
  } = data;

  return await prisma.tarea.update({
    where: { id },
    data: {
      nombre,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
      fecha_fin: fecha_fin ? new Date(fecha_fin) : undefined,
      presupuesto: presupuesto !== undefined ? parseFloat(presupuesto) : undefined,
      parentId: parentId !== undefined ? parseInt(parentId) : undefined,
      metadata: metadata !== undefined ? metadata : undefined,
    },
    include: {
      subtareas: true,
    },
  });
};

exports.remove = async (id) => {
  const tarea = await prisma.tarea.findUnique({ where: { id } });
  if (!tarea) return null;
  await prisma.tarea.delete({ where: { id } });
  return true;
};
