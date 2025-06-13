const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');

router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.get('/proyecto/:pid', TaskController.getByProject);
router.post('/', TaskController.create);
router.patch('/:id', TaskController.update);
router.delete('/:id', TaskController.remove);

module.exports = router;
