const { z } = require('zod');

const createProjectSchema = z.object({
  titulo: z.string().min(1, 'Título requerido'),
  descripcion: z.string().optional(),
  objetivo_general: z.string().optional(),
  fecha_inicio: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de inicio inválida',
  }),
  fecha_fin: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de fin inválida',
  }),
  ownerId: z.string().optional(),
});

const joinProjectSchema = z.object({
  userId: z.string().min(1, 'userId requerido'),
});

module.exports = {
  createProjectSchema,
  joinProjectSchema,
};
