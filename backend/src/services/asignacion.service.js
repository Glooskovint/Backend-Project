const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = async ({ tareaId, usuarioId, fecha_asignacion }) => {
  return prisma.asignacionTarea.create({
    data: {
      tareaId,
      usuarioId,
      fecha_asignacion: fecha_asignacion ? new Date(fecha_asignacion) : new Date(),
    },
  });
};

exports.getAll = async () => {
  return prisma.asignacionTarea.findMany({
    include: {
      tarea: true,
      usuario: true,
    },
  });
};

exports.delete = async (tareaId, usuarioId) => {
  return prisma.asignacionTarea.delete({
    where: {
      tareaId_usuarioId: {
        tareaId,
        usuarioId,
      },
    },
  });
};
