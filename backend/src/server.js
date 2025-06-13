const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

// Rutas y middlewares
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const asignacionRoutes = require('./routes/asignacion.routes');
const objectiveRoutes = require('./routes/objective.routes');

app.get('/', (req, res) => res.send('API funcionando correctamente 🚀'));

app.use('/usuarios', userRoutes);
app.use('/proyectos', projectRoutes);
app.use('/tareas', taskRoutes);
app.use('/asignaciones', asignacionRoutes);
app.use('/objetivos', objectiveRoutes);

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar WebSocket
const io = new Server(server, {
  cors: {
    origin: '*', // Ajusta según tu frontend
    methods: ['GET', 'POST'],
  },
});

// Registrar eventos de conexión
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('joinProject', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`Usuario se unió a project-${projectId}`);
  });

  socket.on('editProjectTitle', ({ projectId, nuevoTitulo }) => {
    // Aquí también podrías actualizar la DB si deseas
    socket.to(`project-${projectId}`).emit('projectTitleUpdated', nuevoTitulo);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Levantar el servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor y WebSocket corriendo en puerto ${PORT}`);
});
