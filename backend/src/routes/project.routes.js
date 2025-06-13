const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const validateBody = require('../middlewares/validateBody');
const { createProjectSchema } = require('../validators/project.schema');

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.get('/:id/miembros', projectController.getMiembros);
router.post('/', validateBody(createProjectSchema), projectController.create);
router.patch('/:id', projectController.update);
router.get('/:id/invite', projectController.getInviteLink);
router.post('/join/:token', projectController.joinByInvite);

module.exports = router;
