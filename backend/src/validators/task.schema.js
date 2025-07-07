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
  assignedMembers: z.array(z.string()).optional(), // Array of user IDs (firebase_uid)
});

const updateTaskSchema = createTaskSchema.extend({
  // All fields from createTaskSchema are optional for update
  proyectoId: z.number().int().optional(),
  nombre: z.string().min(1, 'Nombre requerido').optional(),
  fecha_inicio: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de inicio inválida',
  }).optional(),
  fecha_fin: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de fin inválida',
  }).optional(),
});


module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
