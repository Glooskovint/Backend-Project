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
  // taskNode.fecha_inicio = taskNode.fecha_inicio_calculada; // These are now just for calculation output
  // taskNode.fecha_fin = taskNode.fecha_fin_calculada;
  // taskNode.presupuesto = taskNode.presupuesto_calculado;
  // El campo 'asignaciones' original de la tarea sigue refiriéndose a las asignaciones directas.
  // El frontend puede usar 'equipoTotalCount' para mostrar el número total de personas involucradas.
}

// Function to recursively update parent task aggregates
async function updateParentAggregates(taskId, tx) {
  if (!taskId) return;

  const task = await tx.tarea.findUnique({
    where: { id: taskId },
    include: { subtareas: true, proyecto: true }
  });

  if (!task) return;

  let earliestStartDate = task.fecha_inicio ? new Date(task.fecha_inicio) : null;
  let latestEndDate = task.fecha_fin ? new Date(task.fecha_fin) : null;
  let cumulativeBudget = parseFloat(task.presupuesto) || 0;

  if (task.subtareas && task.subtareas.length > 0) {
    // Reset parent's own dates/budget if it's purely aggregate
    earliestStartDate = null;
    latestEndDate = null;
    cumulativeBudget = 0;

    for (const subtask of task.subtareas) {
      const subtaskStartDate = subtask.fecha_inicio ? new Date(subtask.fecha_inicio) : null;
      const subtaskEndDate = subtask.fecha_fin ? new Date(subtask.fecha_fin) : null;

      if (subtaskStartDate && (!earliestStartDate || subtaskStartDate < earliestStartDate)) {
        earliestStartDate = subtaskStartDate;
      }
      if (subtaskEndDate && (!latestEndDate || subtaskEndDate > latestEndDate)) {
        latestEndDate = subtaskEndDate;
      }
      cumulativeBudget += parseFloat(subtask.presupuesto) || 0;
    }
  }

  const dataToUpdate = {};
  if (earliestStartDate && (!task.fecha_inicio || new Date(task.fecha_inicio).getTime() !== earliestStartDate.getTime())) {
    dataToUpdate.fecha_inicio = earliestStartDate;
  }
  if (latestEndDate && (!task.fecha_fin || new Date(task.fecha_fin).getTime() !== latestEndDate.getTime())) {
    dataToUpdate.fecha_fin = latestEndDate;
  }
  if (task.presupuesto !== cumulativeBudget) { // Check if it's a number before parseFloat
    if (parseFloat(task.presupuesto) !== cumulativeBudget) {
      dataToUpdate.presupuesto = cumulativeBudget;
    }
  }


  if (Object.keys(dataToUpdate).length > 0) {
    await tx.tarea.update({
      where: { id: taskId },
      data: dataToUpdate,
    });
  }

  // Recursively update the next parent
  if (task.parentId) {
    await updateParentAggregates(task.parentId, tx);
  }
}


exports.create = async (data) => {
  const {
    proyectoId,
    parentId,
    nombre,
    fecha_inicio,
    fecha_fin,
    presupuesto,
    assignedMembers, // Extract assignedMembers
  } = data;

  const createdTask = await prisma.tarea.create({
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
      asignaciones: true, // Include asignaciones to return them
    },
  });

  // Handle assignedMembers
  if (assignedMembers && assignedMembers.length > 0) {
    await prisma.asignacionTarea.createMany({
      data: assignedMembers.map(userId => ({
        tareaId: createdTask.id,
        usuarioId: userId,
        fecha_asignacion: new Date(),
      })),
      skipDuplicates: true, // Avoid errors if an assignment already exists (though for creation it's less likely)
    });
  }

  // Re-fetch the task with its assignments to return the complete object
  const taskToReturn = await prisma.tarea.findUnique({
    where: { id: createdTask.id },
    include: {
      subtareas: true,
      asignaciones: { include: { usuario: true } }, // Include user details in assignments
    },
  });

  // After creating a task, update its parent's aggregates
  if (taskToReturn.parentId) {
    await prisma.$transaction(async (tx) => {
      await updateParentAggregates(taskToReturn.parentId, tx);
    });
  }
  return taskToReturn;
};

exports.update = async (id, data) => {
  const {
    nombre,
    fecha_inicio,
    fecha_fin,
    presupuesto,
    parentId,
    metadata,
    assignedMembers, // Extract assignedMembers
  } = data;

  // Start a transaction to handle task update and assignments
  return await prisma.$transaction(async (tx) => {
    // Fetch the task first to check for subtasks
    const taskToUpdate = await tx.tarea.findUnique({
      where: { id },
      include: { subtareas: true },
    });

    if (!taskToUpdate) {
      throw new Error('Tarea no encontrada'); // Or handle as per your error strategy
    }

    const hasSubtasks = taskToUpdate.subtareas && taskToUpdate.subtareas.length > 0;

    const updateData = {
      nombre,
      // Only allow direct update of these fields if there are no subtasks
      fecha_inicio: !hasSubtasks && fecha_inicio ? new Date(fecha_inicio) : undefined,
      fecha_fin: !hasSubtasks && fecha_fin ? new Date(fecha_fin) : undefined,
      presupuesto: !hasSubtasks && presupuesto !== undefined ? parseFloat(presupuesto) : undefined,
      parentId: parentId !== undefined ? parseInt(parentId) : undefined, // parentId can always be updated
      metadata: metadata !== undefined ? metadata : undefined,
    };

    // Remove undefined fields from updateData to avoid overwriting with null
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedTask = await tx.tarea.update({
      where: { id },
      data: updateData,
    });

    // Handle assignedMembers for update:
    // 1. Get current assignments for this task.
    // 2. Determine which assignments to add and which to remove.
    if (assignedMembers !== undefined) { // Only update if assignedMembers is part of the request
      const currentAssignments = await tx.asignacionTarea.findMany({
        where: { tareaId: id },
      });
      const currentMemberIds = currentAssignments.map(a => a.usuarioId);

      const membersToAdd = assignedMembers.filter(userId => !currentMemberIds.includes(userId));
      const assignmentsToRemove = currentAssignments.filter(a => !assignedMembers.includes(a.usuarioId));

      if (membersToAdd.length > 0) {
        await tx.asignacionTarea.createMany({
          data: membersToAdd.map(userId => ({
            tareaId: id,
            usuarioId: userId,
            fecha_asignacion: new Date(),
          })),
        });
      }

      if (assignmentsToRemove.length > 0) {
        await tx.asignacionTarea.deleteMany({
          where: {
            tareaId: id,
            usuarioId: { in: assignmentsToRemove.map(a => a.usuarioId) },
          },
        });
      }
    }

    // After updating the task and its assignments, update parent aggregates
    if (updatedTask.parentId) {
      await updateParentAggregates(updatedTask.parentId, tx);
    } else {
      // If the task itself is a root task and was updated (e.g., name change),
      // we might not need to trigger aggregate updates unless its own dates/budget were changed
      // and it has subtasks (which is handled by the initial check).
      // However, if its parentId changed (e.g. became a root task),
      // the old parent also needs updating.
      if (taskToUpdate.parentId && taskToUpdate.parentId !== updatedTask.parentId) {
        await updateParentAggregates(taskToUpdate.parentId, tx); // Update old parent
      }
    }

    // Re-fetch the task with its updated assignments and potentially updated parent-calculated fields
    return await tx.tarea.findUnique({
      where: { id: updatedTask.id }, // Use id directly, not updatedTask.id as it might not be defined if no direct fields were updated
      include: {
        subtareas: true,
        asignaciones: { include: { usuario: true } },
      },
    });
  });
};

exports.remove = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const taskToRemove = await tx.tarea.findUnique({ where: { id } });
    if (!taskToRemove) return null;

    // Store parentId before deleting
    const parentId = taskToRemove.parentId;

    await tx.asignacionTarea.deleteMany({ where: { tareaId: id } });
    await tx.tarea.deleteMany({ where: { parentId: id } }); // Delete subtasks first if any constraint exists
    await tx.tarea.delete({ where: { id } });

    // After removing a task, update its parent's aggregates
    if (parentId) {
      await updateParentAggregates(parentId, tx);
    }
    return true;
  });
};
