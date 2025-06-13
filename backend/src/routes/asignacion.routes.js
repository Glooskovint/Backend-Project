const express = require('express');
const router = express.Router();
const controller = require('../controllers/asignacion.controller');
const validateBody = require('../middlewares/validateBody');
const { createAsignacionSchema } = require('../validators/asignacion.schema');

router.get('/', controller.getAll);
router.post('/', validateBody(createAsignacionSchema), controller.create);
router.delete('/:tareaId/:usuarioId', controller.delete);

module.exports = router;
