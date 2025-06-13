const { z } = require('zod');

const createObjectiveSchema = z.object({
  proyectoId: z.number().int(),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  orden: z.number().int().nonnegative(),
});

const updateObjectiveSchema = z.object({
  descripcion: z.string().min(1).optional(),
  orden: z.number().int().nonnegative().optional(),
});

module.exports = {
  createObjectiveSchema,
  updateObjectiveSchema,
};
