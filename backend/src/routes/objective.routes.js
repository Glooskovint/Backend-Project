const express = require('express');
const router = express.Router();
const controller = require('../controllers/objective.controller');
const validateBody = require('../middlewares/validateBody');
const { createObjectiveSchema, updateObjectiveSchema } = require('../validators/objective.schema');

router.get('/', controller.getAll);
router.post('/', validateBody(createObjectiveSchema), controller.create);
router.patch('/:id', validateBody(updateObjectiveSchema), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
