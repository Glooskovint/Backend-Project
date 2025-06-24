const prisma = require('../utils/db');

exports.getAll = async () => {
  return await prisma.usuario.findMany();
};

exports.create = async (data) => {
  return await prisma.usuario.create({ data });
};

exports.getByFirebaseUid = async (firebaseUid) => {
  return await prisma.usuario.findUnique({
    where: { firebase_uid: firebaseUid },
  });
}