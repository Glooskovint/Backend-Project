const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

// Configuración CORS más explícita
const allowedOrigins = [
  'http://localhost:3000', // Ejemplo: Frontend local React
  'http://localhost:5173', // Ejemplo: Frontend local Vite
  'http://localhost:8080', // Otro puerto común de desarrollo
  // Patrones para Google Cloud Shell basados en tu ejemplo.
  // Es importante que estos coincidan con los orígenes exactos que usa tu frontend.
  /^https:\/\/\d{4}-cs-([a-f0-9-]+)\.cs-([a-z0-9-]+)-pkhd\.cloudshell\.dev$/,
  // Si tienes un dominio personalizado para el frontend desplegado, añádelo aquí:
  // 'https://tu-frontend-dominio.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman o curl directo, o mobile apps)
    if (!origin) return callback(null, true);

    // Verificar si el origen está en la lista blanca o coincide con un patrón Regex
    if (allowedOrigins.some(allowedOrigin =>
        typeof allowedOrigin === 'string' ? allowedOrigin === origin : allowedOrigin.test(origin)
      )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true, // Importante si envías cookies o encabezados de autorización
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11) tienen problemas con 204
};

app.use(cors(corsOptions));

// Habilitar el manejo de solicitudes preflight para todas las rutas
// Esto es a menudo útil si hay proxies o configuraciones complejas.
app.options('*', cors(corsOptions));

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
// Usaremos las mismas corsOptions definidas para Express para consistencia,
// aunque Socket.IO tiene un subconjunto más limitado de lo que considera relevante aquí.
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin, // Reutiliza la función de validación de origen
    methods: ['GET', 'POST'], // Socket.IO principalmente usa GET/POST para el handshake
    allowedHeaders: corsOptions.allowedHeaders, // Puede ser relevante si hay encabezados personalizados en el handshake
    credentials: corsOptions.credentials // Importante para consistencia si el cliente envía credenciales
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
