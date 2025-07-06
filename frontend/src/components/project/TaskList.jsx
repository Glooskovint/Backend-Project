import { useMemo, useState } from 'react';
import TaskRow from './TaskRow';

// Componente para el encabezado, mejora la legibilidad
const TableHeader = () => (
  <div className="flex bg-gray-50 border-b border-gray-200">
    <div className="table-header flex-1">Tarea</div>
    <div className="table-header w-32">Inicio</div>
    <div className="table-header w-32">Fin</div>
    <div className="table-header w-32">Presupuesto</div>
    <div className="table-header w-32">Asignados</div>
    <div className="table-header w-24">Acciones</div>
  </div>
);

export default function TaskList({ tasks, onEdit, onDelete }) {
  // El estado de expansión ahora vive aquí, más cerca de donde se usa
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  const toggleExpand = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    newExpanded.has(taskId) ? newExpanded.delete(taskId) : newExpanded.add(taskId);
    setExpandedTasks(newExpanded);
  };

  // La lógica para encontrar las tareas raíz se mueve aquí
  const rootTasks = useMemo(() => {
    const subtaskIds = new Set(tasks.flatMap(t => t.subtareas || []).map(s => s.id));
    return tasks.filter(t => !subtaskIds.has(t.id));
  }, [tasks]);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <TableHeader />
          <div>
            {rootTasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                level={index + 1}
                path={[]}
                onEdit={onEdit}
                onDelete={onDelete}
                expandedTasks={expandedTasks}
                onToggleExpand={toggleExpand}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}