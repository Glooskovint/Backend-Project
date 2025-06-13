const prisma = require('../utils/db');

exports.getAll = async () => {
  return await prisma.usuario.findMany();
};

exports.create = async (data) => {
  return await prisma.usuario.create({ data });
};