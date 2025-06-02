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

  return (
    <>
      <div className="task-row" style={{ paddingLeft: `${level * 20}px` }}>
        <div className="task-name">
          {isEditing ? (
            <input
              value={taskData.nombre}
              onChange={(e) =>
                setTaskData({ ...taskData, nombre: e.target.value })
              }
            />
          ) : (
            <span>{task.nombre}</span>
          )}
        </div>
        {/* ... otros campos ... */}
        <div className="task-actions">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Guardar" : "Editar"}
          </button>
          <button onClick={handleAddSubtask}>+ Subtarea</button>
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
