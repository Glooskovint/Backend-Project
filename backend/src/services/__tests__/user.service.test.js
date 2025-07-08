const userService = require('../user.service');
const prisma = require('../../utils/db');

// Mockear el módulo prisma
jest.mock('../../utils/db', () => ({
  usuario: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe('UserService', () => {
  afterEach(() => {
    // Limpiar todos los mocks después de cada test
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería retornar todos los usuarios', async () => {
      const mockUsuarios = [{ id: 1, nombre: 'Usuario 1' }, { id: 2, nombre: 'Usuario 2' }];
      prisma.usuario.findMany.mockResolvedValue(mockUsuarios);

      const usuarios = await userService.getAll();
      expect(usuarios).toEqual(mockUsuarios);
      expect(prisma.usuario.findMany).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar un error si prisma.usuario.findMany falla', async () => {
      const errorMessage = 'Error de base de datos';
      prisma.usuario.findMany.mockRejectedValue(new Error(errorMessage));

      await expect(userService.getAll()).rejects.toThrow(errorMessage);
      expect(prisma.usuario.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('debería crear y retornar un nuevo usuario', async () => {
      const datosUsuario = { firebase_uid: 'fbuid123', email: 'test@example.com', nombre: 'Test User' };
      const usuarioCreado = { id: 1, ...datosUsuario };
      prisma.usuario.create.mockResolvedValue(usuarioCreado);

      const nuevoUsuario = await userService.create(datosUsuario);
      expect(nuevoUsuario).toEqual(usuarioCreado);
      expect(prisma.usuario.create).toHaveBeenCalledWith({ data: datosUsuario });
      expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar un error si prisma.usuario.create falla', async () => {
      const datosUsuario = { firebase_uid: 'fbuid123', email: 'test@example.com', nombre: 'Test User' };
      const errorMessage = 'Error al crear usuario';
      prisma.usuario.create.mockRejectedValue(new Error(errorMessage));

      await expect(userService.create(datosUsuario)).rejects.toThrow(errorMessage);
      expect(prisma.usuario.create).toHaveBeenCalledWith({ data: datosUsuario });
      expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByFirebaseUid', () => {
    it('debería retornar un usuario por su firebase_uid', async () => {
      const firebaseUid = 'fbuid123';
      const mockUsuario = { id: 1, firebase_uid: firebaseUid, nombre: 'Test User' };
      prisma.usuario.findUnique.mockResolvedValue(mockUsuario);

      const usuario = await userService.getByFirebaseUid(firebaseUid);
      expect(usuario).toEqual(mockUsuario);
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { firebase_uid: firebaseUid } });
      expect(prisma.usuario.findUnique).toHaveBeenCalledTimes(1);
    });

    it('debería retornar null si el usuario no se encuentra por firebase_uid', async () => {
      const firebaseUid = 'fbuidNoExistente';
      prisma.usuario.findUnique.mockResolvedValue(null);

      const usuario = await userService.getByFirebaseUid(firebaseUid);
      expect(usuario).toBeNull();
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { firebase_uid: firebaseUid } });
      expect(prisma.usuario.findUnique).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar un error si prisma.usuario.findUnique falla', async () => {
      const firebaseUid = 'fbuid123';
      const errorMessage = 'Error de base de datos al buscar por UID';
      prisma.usuario.findUnique.mockRejectedValue(new Error(errorMessage));

      await expect(userService.getByFirebaseUid(firebaseUid)).rejects.toThrow(errorMessage);
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { firebase_uid: firebaseUid } });
      expect(prisma.usuario.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
