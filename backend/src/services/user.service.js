const UserRepo = require('../repositories/user.repository');

const getAllUsers = () => UserRepo.getAll();

const getUserById = (uid) => UserRepo.getById(uid);

const createUser = async (data) => {
    if (!data.firebase_uid || !data.email || !data.nombre) {
        throw new Error('Faltan campos obligatorios');
    }
    return await UserRepo.create(data);
};

const updateUser = async (uid, data) => {
    return await UserRepo.update(uid, data);
};

const deleteUser = async (uid) => {
    return await UserRepo.remove(uid);
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
