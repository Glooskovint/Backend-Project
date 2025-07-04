const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = async (data) => {
  return prisma.objetivoEspecifico.create({ data });
};

exports.getAll = async () => {
  return prisma.objetivoEspecifico.findMany();
};

exports.update = async (id, data) => {
  return prisma.objetivoEspecifico.update({
    where: { id },
    data,
  });
};

exports.delete = async (id) => {
  return prisma.objetivoEspecifico.delete({ where: { id } });
};
