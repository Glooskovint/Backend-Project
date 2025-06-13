const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

// Rutas principales
app.use('/usuarios', userRoutes);
app.use('/proyectos', projectRoutes);
app.use('/tareas', taskRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API corriendo en puerto ${PORT}`);
});
