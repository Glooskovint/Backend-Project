const UserService = require('../services/user.service');

const getAll = async (req, res) => {
    try {
        const usuarios = await UserService.getAllUsers();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const usuario = await UserService.getUserById(req.params.uid);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const usuario = await UserService.createUser(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const usuario = await UserService.updateUser(req.params.uid, req.body);
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await UserService.deleteUser(req.params.uid);
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
