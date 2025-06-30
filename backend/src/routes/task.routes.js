const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const validateBody = require('../middlewares/validateBody');
const { createTaskSchema } = require('../validators/task.schema');

router.get('/', taskController.getAll);
router.post('/', validateBody(createTaskSchema), taskController.create);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.remove);
router.get('/proyecto/:id', taskController.getByProject);

module.exports = router;
