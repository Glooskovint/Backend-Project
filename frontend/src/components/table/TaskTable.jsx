import { useState } from "react";
import TaskRow from "./TaskRow";
import "./Table.css";

export default function TaskTable({ tasks, onUpdateTasks, projectId }) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const today = new Date().toISOString();

    fetch("http://localhost:5000/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proyectoId: projectId,
        nombre: newTask,
        fecha_inicio: today,
        fecha_fin: today,
        presupuesto: 0,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear tarea");
        return res.json();
      })
      .then((task) => {
        onUpdateTasks([...tasks, task]);
        setNewTask("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al crear tarea");
      });
    };

  return (
    <div className="task-table">
      <div className="table-header">
        <span>Tarea</span>
        <span>Fecha Inicio</span>
        <span>Fecha Fin</span>
        <span>Presupuesto</span>
        <span>Responsable</span>
      </div>
      <div className="table-body">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            level={0}
            onUpdate={onUpdateTasks}
            projectId={projectId}
          />
        ))}
      </div>
      <div className="table-footer">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button onClick={handleAddTask}>Añadir</button>
      </div>
    </div>
  );
}
