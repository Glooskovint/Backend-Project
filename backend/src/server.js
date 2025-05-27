const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

// --- Rutas para Usuario ---
app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

app.post('/usuarios', async (req, res) => {
  const { firebase_uid, email, nombre } = req.body;

  if (!firebase_uid || !email || !nombre) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const usuario = await prisma.usuario.create({
      data: { firebase_uid, email, nombre }
    });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// --- Rutas para Proyecto ---
app.get('/proyectos', async (req, res) => {
  const { ownerId } = req.query;

  try {
    const proyectos = await prisma.proyecto.findMany({
      where: ownerId ? { ownerId } : undefined
    });
    res.json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

app.get('/proyectos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(proyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error al obtener el proyecto' });
  }
});

app.post('/proyectos', async (req, res) => {
  const {
    titulo,
    fecha_inicio,
    fecha_fin,
    descripcion,
    objetivo_general,
    ownerId,
  } = req.body;

  if (!titulo || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: titulo, fecha_inicio, fecha_fin' });
  }

  try {
    const proyecto = await prisma.proyecto.create({
      data: {
        titulo,
        descripcion: descripcion || '',
        objetivo_general: objetivo_general || '',
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        ownerId: ownerId || null,
      },
    });
    res.json(proyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
});

app.patch('/proyectos/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const proyecto = await prisma.proyecto.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(proyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});

// --- Rutas para MiembroProyecto ---
app.get('/miembros', async (req, res) => {
  const miembros = await prisma.miembroProyecto.findMany();
  res.json(miembros);
});

app.post('/miembros', async (req, res) => {
  const { usuarioId, proyectoId, rol } = req.body;
  const miembro = await prisma.miembroProyecto.create({ data: { usuarioId, proyectoId, rol } });
  res.json(miembro);
});

// --- Rutas para ObjetivoEspecifico ---
app.get('/objetivos', async (req, res) => {
  const objetivos = await prisma.objetivoEspecifico.findMany();
  res.json(objetivos);
});

app.post('/objetivos', async (req, res) => {
  const { proyectoId, descripcion } = req.body;
  const objetivo = await prisma.objetivoEspecifico.create({ data: { proyectoId, descripcion } });
  res.json(objetivo);
});

// --- Rutas para Tarea ---
app.get('/tareas', async (req, res) => {
  const tareas = await prisma.tarea.findMany();
  res.json(tareas);
});

app.post('/tareas', async (req, res) => {
  const { proyectoId, asignacionTareaId, titulo, descripcion } = req.body;
  const tarea = await prisma.tarea.create({ data: { proyectoId, asignacionTareaId, titulo, descripcion } });
  res.json(tarea);
});

// --- Rutas para AsignacionTarea ---
app.get('/asignaciones', async (req, res) => {
  const asignaciones = await prisma.asignacionTarea.findMany();
  res.json(asignaciones);
});

app.post('/asignaciones', async (req, res) => {
  const { tareaId, usuarioId, estado } = req.body;
  const asignacion = await prisma.asignacionTarea.create({ data: { tareaId, usuarioId, estado } });
  res.json(asignacion);
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API corriendo en puerto ${PORT}`);
});