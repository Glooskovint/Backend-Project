const { prisma } = require('../utils/db');

const createObjective = (data) => prisma.objetivoEspecifico.create({ data });

const getObjectivesByProjectId = (proyectoId) =>
  prisma.objetivoEspecifico.findMany({ where: { proyectoId }, orderBy: { orden: 'asc' } });

module.exports = {
  createObjective,
  getObjectivesByProjectId,
};
