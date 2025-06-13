const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/', UserController.getAll);
router.get('/:uid', UserController.getById);
router.post('/', UserController.create);
router.patch('/:uid', UserController.update);
router.delete('/:uid', UserController.remove);

module.exports = router;
