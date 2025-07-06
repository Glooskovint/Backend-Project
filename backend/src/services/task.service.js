const prisma = require('../utils/db');

exports.getAll = async () => {
  // Podríamos querer aplicar la misma lógica de anidamiento aquí si se usa en algún lugar
  // pero por ahora, nos enfocamos en getByProject
  return await prisma.tarea.findMany({
    include: {
      proyecto: true,
      // No incluimos subtareas aquí directamente, se construirán después
    }
  });
};

// Función auxiliar para construir el árbol de tareas
const buildTaskTree = (tasks) => {
  const taskMap = {};
  const taskTree = [];

  // Primera pasada: crear un mapa de todas las tareas por su ID
  // y asegurar que cada tarea tenga un array 'subtareas' inicializado.
  tasks.forEach(task => {
    taskMap[task.id] = { ...task, subtareas: [] };
  });

  // Segunda pasada: asignar cada tarea a su padre correspondiente en el mapa
  tasks.forEach(task => {
    if (task.parentId && taskMap[task.parentId]) {
      // Si tiene un padre y el padre existe en el mapa, añadir como subtarea
      taskMap[task.parentId].subtareas.push(taskMap[task.id]);
    } else if (!task.parentId) {
      // Si no tiene padre, es una tarea raíz
      taskTree.push(taskMap[task.id]);
    }
  });

  return taskTree;
};

exports.getByProject = async (proyectoId) => {
  const flatTasks = await prisma.tarea.findMany({
    where: { proyectoId: parseInt(proyectoId) },
    include: {
      // Incluimos asignaciones y proyecto para tener datos completos por tarea
      // 'subtareas' se construirá manualmente
      asignaciones: {
        include: {
          usuario: true, // Para obtener detalles del usuario asignado si es necesario
        }
      },
      proyecto: true,
    },
    orderBy: { // Opcional: puede ayudar a la consistencia, aunque el árbol se construye por parentId
      id: 'asc'
    }
  });

  if (!flatTasks || flatTasks.length === 0) {
    return [];
  }

  const taskTree = buildTaskTree(flatTasks);

  // Después de construir el árbol, calcular las propiedades agregadas
  taskTree.forEach(rootTask => calculateTaskAggregates(rootTask));

  return taskTree;
};

// Función recursiva para calcular propiedades agregadas
function calculateTaskAggregates(taskNode) {
  // Inicializar con los valores propios de la tarea actual (si los tiene)
  // Asegurarse de que las fechas sean objetos Date para la comparación
  let earliestStartDate = taskNode.fecha_inicio ? new Date(taskNode.fecha_inicio) : null;
  let latestEndDate = taskNode.fecha_fin ? new Date(taskNode.fecha_fin) : null;
  let cumulativeBudget = parseFloat(taskNode.presupuesto) || 0;
  const memberIds = new Set(taskNode.asignaciones ? taskNode.asignaciones.map(a => a.usuarioId) : []);

  if (taskNode.subtareas && taskNode.subtareas.length > 0) {
    taskNode.subtareas.forEach(subtask => {
      calculateTaskAggregates(subtask); // Recursión post-orden para calcular primero los hijos

      // Actualizar fechas basadas en los hijos
      if (subtask.fecha_inicio_calculada) { // Usamos un campo temporal para no confundir con la fecha original de la subtarea
        const subtaskStartDate = new Date(subtask.fecha_inicio_calculada);
        if (!earliestStartDate || subtaskStartDate < earliestStartDate) {
          earliestStartDate = subtaskStartDate;
        }
      }
      if (subtask.fecha_fin_calculada) {
        const subtaskEndDate = new Date(subtask.fecha_fin_calculada);
        if (!latestEndDate || subtaskEndDate > latestEndDate) {
          latestEndDate = subtaskEndDate;
        }
      }

      // Sumar presupuesto de los hijos
      cumulativeBudget += subtask.presupuesto_calculado || 0;

      // Unir miembros de los hijos
      if (subtask.miembros_calculados_set) {
        subtask.miembros_calculados_set.forEach(memberId => memberIds.add(memberId));
      }
    });
  }

  // Almacenar los valores calculados en la tarea actual.
  // Estos son los valores que el frontend finalmente usará para esta tarea.
  taskNode.fecha_inicio_calculada = earliestStartDate ? earliestStartDate.toISOString() : taskNode.fecha_inicio; // Mantener original si no hay cálculo
  taskNode.fecha_fin_calculada = latestEndDate ? latestEndDate.toISOString() : taskNode.fecha_fin;
  taskNode.presupuesto_calculado = cumulativeBudget;
  taskNode.miembros_calculados_set = memberIds; // Este set se usa para la agregación

  // Para el frontend, podríamos querer enviar un array de miembros o solo la cuenta
  // Por ahora, el frontend ya lee task.asignaciones.length para los miembros directos.
  // Si queremos mostrar el total de miembros (directos + indirectos), necesitaríamos un nuevo campo.
  // Vamos a añadir un campo 'equipoTotalCount' para el conteo.
  taskNode.equipoTotalCount = memberIds.size;

  // Decidimos si sobrescribir los campos originales o usar nuevos campos para el frontend.
  // Por consistencia con el problema ("Cálculo automático de propiedades"),
  // vamos a actualizar los campos principales que el frontend ya usa.
  taskNode.fecha_inicio = taskNode.fecha_inicio_calculada;
  taskNode.fecha_fin = taskNode.fecha_fin_calculada;
  taskNode.presupuesto = taskNode.presupuesto_calculado;
  // El campo 'asignaciones' original de la tarea sigue refiriéndose a las asignaciones directas.
  // El frontend puede usar 'equipoTotalCount' para mostrar el número total de personas involucradas.
}


exports.create = async (data) => {
  const {
    proyectoId,
    parentId,
    nombre,
    fecha_inicio,
    fecha_fin,
    presupuesto,
  } = data;

  return await prisma.tarea.create({
    data: {
      proyectoId: parseInt(proyectoId),
      parentId: parentId ? parseInt(parentId) : null,
      nombre,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      presupuesto: parseFloat(presupuesto) || 0,
      metadata: {},
    },
    include: {
      subtareas: true,
    },
  });
};
 
exports.update = async (id, data) => {
  const {
    nombre,
    fecha_inicio,
    fecha_fin,
    presupuesto, 
    parentId,
    metadata,
  } = data;

  return await prisma.tarea.update({
    where: { id },
    data: {
      nombre,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
      fecha_fin: fecha_fin ? new Date(fecha_fin) : undefined,
      presupuesto: presupuesto !== undefined ? parseFloat(presupuesto) : undefined,
      parentId: parentId !== undefined ? parseInt(parentId) : undefined,
      metadata: metadata !== undefined ? metadata : undefined,
    },
    include: {
      subtareas: true,
    },
  });
};

exports.remove = async (id) => {
  const tarea = await prisma.tarea.findUnique({ where: { id } });
  if (!tarea) return null;
  await prisma.tarea.delete({ where: { id } });
  return true;
};
