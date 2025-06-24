const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateBody = require('../middlewares/validateBody');
const { createUserSchema } = require('../validators/user.schema');

router.get('/', userController.getAll);
router.post('/', validateBody(createUserSchema), userController.create);
router.get('/firebase/:firebaseUid', userController.getByFirebaseUid);

module.exports = router;
