const { ZodError } = require('zod');

function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validación fallida',
          detalles: error.errors.map(e => ({
            campo: e.path.join('.'),
            mensaje: e.message
          }))
        });
      }
      next(error);
    }
  };
}

module.exports = validateBody;
