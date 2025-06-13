const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.get('/usuario/:uid', ProjectController.getByUser);
router.post('/', ProjectController.create);
router.patch('/:id', ProjectController.update);
router.delete('/:id', ProjectController.remove);

module.exports = router;
