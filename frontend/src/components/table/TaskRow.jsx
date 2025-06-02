import { useState } from 'react';

export default function TaskRow({ task, level, onUpdate, projectId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState(task);

  const handleAddSubtask = () => {
    fetch('http://localhost:5000/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proyectoId: projectId,
        parentId: task.id,
        nombre: 'Nueva subtarea',
        fecha_inicio: taskData.fecha_inicio,
        fecha_fin: taskData.fecha_fin,
        presupuesto: 0
      })
    })
    .then(res => res.json())
    .then(subtask => {
      onUpdate(prev => {
        const updateTasks = (tasks) => tasks.map(t => 
          t.id === task.id 
            ? { ...t, subtareas: [...t.subtareas, subtask] } 
            : t
        );
        return updateTasks(prev);
      });
    });
  };

  return (
    <>
      <div className="task-row" style={{ paddingLeft: `${level * 20}px` }}>
        <div className="task-name">
          {isEditing ? (
            <input
              value={taskData.nombre}
              onChange={(e) => setTaskData({...taskData, nombre: e.target.value})}
            />
          ) : (
            <span>{task.nombre}</span>
          )}
        </div>
        {/* ... otros campos ... */}
        <div className="task-actions">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Guardar' : 'Editar'}
          </button>
          <button onClick={handleAddSubtask}>+ Subtarea</button>
        </div>
      </div>
      {task.subtareas?.map(subtask => (
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