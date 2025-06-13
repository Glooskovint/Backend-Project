const userService = require('../services/user.service');

exports.getAll = async (req, res) => {
    try {
        const usuarios = await userService.getAll();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.create = async (req, res) => {
    const { firebase_uid, email, nombre } = req.body;

    if (!firebase_uid || !email || !nombre) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const nuevoUsuario = await userService.create({ firebase_uid, email, nombre });
        res.json(nuevoUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};