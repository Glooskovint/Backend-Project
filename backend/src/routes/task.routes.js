const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const validateBody = require('../middlewares/validateBody');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.schema');

router.get('/', taskController.getAll);
router.post('/', validateBody(createTaskSchema), taskController.create);
router.patch('/:id', validateBody(updateTaskSchema), taskController.update); // Changed PUT to PATCH and added validation
router.delete('/:id', taskController.remove);
router.get('/proyecto/:id', taskController.getByProject); // Corrected route parameter name

module.exports = router;
