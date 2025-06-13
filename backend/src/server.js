const express = require('express');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const asignacionRoutes = require('./routes/asignacion.routes');
const objectiveRoutes = require('./routes/objective.routes');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => res.send('API funcionando correctamente 🚀'));

app.use('/usuarios', userRoutes);
app.use('/proyectos', projectRoutes);
app.use('/tareas', taskRoutes);
app.use('/asignaciones', asignacionRoutes);
app.use('/objetivos', objectiveRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API corriendo en puerto ${PORT}`);
});