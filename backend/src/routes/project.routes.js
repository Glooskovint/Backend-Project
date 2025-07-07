const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const validateBody = require('../middlewares/validateBody');
const { createProjectSchema, updateProjectSchema } = require('../validators/project.schema'); // Import updateProjectSchema

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.get('/:id/miembros', projectController.getMiembros);
router.get('/compartidos/:userId', projectController.getSharedProjects);
router.post('/', validateBody(createProjectSchema), projectController.create);
router.patch('/:id', validateBody(updateProjectSchema), projectController.update); // Add validation for update
router.get('/:id/invite', projectController.getInviteLink);
router.post('/join/:token', projectController.joinByInvite);
router.delete('/:id', projectController.remove);

module.exports = router;
