const { z } = require('zod');

const createAsignacionSchema = z.object({
  tareaId: z.number().int(),
  usuarioId: z.string().min(1, 'El usuarioId es obligatorio'),
  fecha_asignacion: z.string().datetime().optional(),
});

module.exports = {
  createAsignacionSchema,
};
