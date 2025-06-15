import { useState } from "react";

export default function TaskRow({ task, level, onUpdate, projectId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState(task);

  const handleAddSubtask = () => {
    const today = new Date().toISOString();

    fetch("http://localhost:5000/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proyectoId: projectId,
        parentId: task.id,
        nombre: "Nueva subtarea",
        fecha_inicio: today,
        fecha_fin: today,
        presupuesto: 0,
        metadata: {},
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear subtarea");
        return res.json();
      })
      .then((newSubtask) => {
        onUpdate((prevTasks) => {
          // Función recursiva para encontrar y actualizar la tarea padre
          const updateTasks = (tasks) =>
            tasks.map((t) => {
              if (t.id === task.id) {
                return {
                  ...t,
                  subtareas: [...(t.subtareas || []), newSubtask],
                };
              }
              if (t.subtareas && t.subtareas.length > 0) {
                return {
                  ...t,
                  subtareas: updateTasks(t.subtareas),
                };
              }
              return t;
            });

          return updateTasks(prevTasks);
        });
      })
      .catch((error) => {
        console.error("Error al añadir subtarea:", error);
        alert("Error al añadir subtarea");
      });
  };

  const saveTask = () => {
  fetch(`http://localhost:5000/tareas/${task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: taskData.nombre,
      fecha_inicio: taskData.fecha_inicio,
      fecha_fin: taskData.fecha_fin,
      presupuesto: taskData.presupuesto
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al guardar");
      return res.json();
    })
    .then((data) => {
      console.log("Guardado con éxito:", data);
      setIsEditing(false);
    })
    .catch((err) => {
      console.error(err);
      alert("Error al guardar");
    });
};

const deleteTask = () => {
  if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
    return;
  }

  fetch(`http://localhost:5000/tareas/${task.id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar tarea");
      onUpdate((prevTasks) =>
        prevTasks.filter((t) => t.id !== task.id)
      );
    })
    .catch((error) => {
      console.error("Error al eliminar tarea:", error);
      alert("Error al eliminar tarea");
    });
}


  const handleSaveOrEdit = () => {
  if (isEditing) {
    saveTask();
  } else {
    setIsEditing(true);
  }
};


  return (
    <>
      <div className="task-row">
        <div className="task-name"  style={{ paddingLeft: `${level * 20}px` }}>
          {isEditing ? (
            <input
              className="control"
              value={taskData.nombre}
              onChange={(e) =>
                setTaskData({ ...taskData, nombre: e.target.value })
              }
            />
          ) : (
            <span>{task.nombre}</span>
          )}
        </div>
        <div>
          {
            isEditing ? (
              <input
                class="control"
                type="date"
                value={taskData.fecha_inicio}
                onChange={(e) =>
                  setTaskData({ ...taskData, fecha_inicio: e.target.value })
                }
                />
            ) : (
              <span>{new Date(task.fecha_inicio).toLocaleDateString()}</span>
            )
          }
        </div>
        <div>
          {
            isEditing ? (
              <input
                class="control"
                type="date"
                value={taskData.fecha_fin}
                onChange={(e) =>
                  setTaskData({ ...taskData, fecha_fin: e.target.value })
                }
              />
            ) : (
              <span>{new Date(task.fecha_fin).toLocaleDateString()}</span>
            )
          }
        </div>
        <div>
          {
            isEditing ? (
              <input 
                class="control"
                type="number"
                value={taskData.presupuesto}
                onChange={(e) =>
                  setTaskData({ ...taskData, presupuesto: e.target.value })
                }  />
            ) : (
              <span>{task.presupuesto}</span>
            )
          }
        </div>
        <div>
          {
            isEditing ? (
              <select class="control">
                <option value="0">Sin asignar</option>
              </select>
            ) : (
              <span>{task.responsable || "Sin asignar"}</span>
            )
          }
        </div>
        <div className="task-actions">
          <button onClick={handleSaveOrEdit}>
            {isEditing ? <i class="fas fa-floppy-disk"></i> : <i class="fa fa-pen-to-square"></i>}
          </button>
          <button onClick={handleAddSubtask}><i class="fas fa-folder-tree"></i></button>
          <button onClick={deleteTask}><i class="fas fa-trash"></i></button>
        </div>
      </div>
      {task.subtareas?.map((subtask) => (
        <TaskRow
          key={subtask.id}
          task={subtask}
          level={level + 1}
          onUpdate={onUpdate}
          projectId={projectId}
        />
      ))}
    </>
  );
}
