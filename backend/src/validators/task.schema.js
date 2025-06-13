const { z } = require('zod');

const createTaskSchema = z.object({
  proyectoId: z.number().int(),
  parentId: z.number().int().nullable().optional(),
  nombre: z.string().min(1, 'Nombre requerido'),
  fecha_inicio: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de inicio inválida',
  }),
  fecha_fin: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de fin inválida',
  }),
  presupuesto: z.number().optional(),
});

module.exports = {
  createTaskSchema,
};
