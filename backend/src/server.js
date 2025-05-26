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
  const { nombre, email } = req.body;
  const usuario = await prisma.usuario.create({ data: { nombre, email } });
  res.json(usuario);
});

// --- Rutas para Proyecto ---
app.get('/proyectos', async (req, res) => {
  const proyectos = await prisma.proyecto.findMany();
  res.json(proyectos);
});

app.post('/proyectos', async (req, res) => {
  const { nombre, descripcion } = req.body;
  const proyecto = await prisma.proyecto.create({ data: { nombre, descripcion } });
  res.json(proyecto);
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