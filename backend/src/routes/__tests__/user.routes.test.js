const request = require('supertest');
const express = require('express');
const userRoutes = require('../user.routes');
const userService = require('../../services/user.service');
const errorHandler = require('../../middlewares/errorHandler'); // Asumiendo que tienes un manejador de errores global

// Mockear el servicio de usuario
jest.mock('../../services/user.service');

// Mockear el middleware validateBody para que no interfiera con los tests de rutas
// Si el middleware es complejo, podrías necesitar un mock más elaborado.
jest.mock('../../middlewares/validateBody', () => jest.fn((schema) => (req, res, next) => next()));


const app = express();
app.use(express.json());
app.use('/users', userRoutes); // Montar las rutas de usuario bajo /users
app.use(errorHandler); // Añadir manejador de errores global si existe

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('debería retornar todos los usuarios y un estado 200', async () => {
      const mockUsers = [{ id: 1, nombre: 'Usuario 1' }, { id: 2, nombre: 'Usuario 2' }];
      userService.getAll.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(userService.getAll).toHaveBeenCalledTimes(1);
    });

    it('debería retornar un estado 500 si el servicio falla', async () => {
      userService.getAll.mockRejectedValue(new Error('Error de servicio'));
      const response = await request(app).get('/users');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error al obtener usuarios' });
    });
  });

  describe('POST /users', () => {
    it('debería crear un usuario y retornar un estado 200 con el usuario creado', async () => {
      const userData = { firebase_uid: 'fbuid123', email: 'test@example.com', nombre: 'Test User' };
      const createdUser = { id: 1, ...userData };
      userService.create.mockResolvedValue(createdUser);

      const response = await request(app).post('/users').send(userData);
      expect(response.status).toBe(200); // El controlador devuelve 200 en éxito, no 201
      expect(response.body).toEqual(createdUser);
      expect(userService.create).toHaveBeenCalledWith(userData);
    });

    it('debería retornar un estado 400 si faltan campos obligatorios (simulado, ya que el controlador lo maneja)', async () => {
        // No necesitamos mockear userService.create aquí porque el controlador debería rechazar antes
        const incompleteUserData = { email: 'test@example.com' }; // Falta firebase_uid y nombre

        const response = await request(app).post('/users').send(incompleteUserData);

        // El controlador user.controller.js tiene su propia validación de campos
        // No depende del validateBody mockeado para esta validación específica.
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Faltan campos obligatorios' });
        expect(userService.create).not.toHaveBeenCalled();
      });

    it('debería retornar un estado 500 si el servicio falla al crear', async () => {
      const userData = { firebase_uid: 'fbuid123', email: 'test@example.com', nombre: 'Test User' };
      userService.create.mockRejectedValue(new Error('Error al crear'));

      const response = await request(app).post('/users').send(userData);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error al crear el usuario' });
    });
  });

  describe('GET /users/firebase/:firebaseUid', () => {
    it('debería retornar un usuario por firebaseUid y estado 200', async () => {
      const firebaseUid = 'fbuid123';
      const mockUser = { id: 1, firebase_uid: firebaseUid, nombre: 'Test User' };
      userService.getByFirebaseUid.mockResolvedValue(mockUser);

      const response = await request(app).get(`/users/firebase/${firebaseUid}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(userService.getByFirebaseUid).toHaveBeenCalledWith(firebaseUid);
    });

    it('debería retornar un estado 404 si el usuario no se encuentra', async () => {
      const firebaseUid = 'fbuidNoExiste';
      userService.getByFirebaseUid.mockResolvedValue(null);

      const response = await request(app).get(`/users/firebase/${firebaseUid}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Usuario no encontrado' });
    });

    it('debería retornar un estado 500 si el servicio falla', async () => {
      const firebaseUid = 'fbuid123';
      userService.getByFirebaseUid.mockRejectedValue(new Error('Error de servicio'));

      const response = await request(app).get(`/users/firebase/${firebaseUid}`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error interno' });
    });
  });
});
