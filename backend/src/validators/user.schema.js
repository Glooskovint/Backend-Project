const { z } = require('zod');

const createUserSchema = z.object({
  firebase_uid: z.string().min(1, 'firebase_uid requerido'),
  email: z.string().email('Email inválido'),
  nombre: z.string().min(1, 'Nombre requerido'),
});

module.exports = {
  createUserSchema,
};
