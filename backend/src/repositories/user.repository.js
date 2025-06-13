const prisma = require('../utils/db');

const getAll = () => prisma.usuario.findMany();

const getById = (firebase_uid) => prisma.usuario.findUnique({
  where: { firebase_uid }
});

const create = ({ firebase_uid, email, nombre }) =>
  prisma.usuario.create({
    data: { firebase_uid, email, nombre }
  });

const update = (firebase_uid, data) =>
  prisma.usuario.update({
    where: { firebase_uid },
    data
  });

const remove = (firebase_uid) =>
  prisma.usuario.delete({
    where: { firebase_uid }
  });

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
