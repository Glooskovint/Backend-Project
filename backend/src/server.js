const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

// Configuración CORS para producción
const allowedOrigins = [
  'http://localhost', // Para Nginx en local sirviendo en puerto 80
  'http://localhost:80', // Alternativa para Nginx
  'https://localhost', // Para Nginx en local sirviendo en puerto 443 (si se configura HTTPS)
  'https://localhost:443', // Alternativa para Nginx
  // Añade aquí tu dominio de producción, por ejemplo:
  // 'https://tuapp.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin 'origin' (por ejemplo, Postman, curl, o si Nginx reescribe la cabecera)
    // O si el origen está en la lista de permitidos.
    // En un entorno de producción estricto, podrías querer eliminar `!origin`
    // si todas las solicitudes deben provenir de un navegador y a través de Nginx que establece el origen.
    if (!origin || allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
      callback(null, true);
    } else {
      console.warn(`Bloqueado por CORS: Origen ${origin} no permitido.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilitar preflight requests

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

// Middleware de manejo de errores (debe ser el último middleware)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

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
