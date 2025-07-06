// src/components/TaskRow.jsx

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronRight,
  ChevronDown,
  Calendar,
  DollarSign,
  User,
  Edit3,
  Trash2,
} from "lucide-react";

const TaskActions = ({ task, onEdit, onDelete }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onEdit(task)}
      className="p-1 text-gray-500 hover:text-primary-600"
      aria-label={`Editar tarea ${task.nombre}`}
    >
      <Edit3 className="w-4 h-4" />
    </button>
    <button
      onClick={() => onDelete(task.id)}
      className="p-1 text-gray-500 hover:text-red-600"
      aria-label={`Eliminar tarea ${task.nombre}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

export default function TaskRow({
  task,
  level,
  path,
  onEdit,
  onDelete,
  expandedTasks,
  onToggleExpand,
}) {
  const hasSubtasks = task.subtareas?.length > 0;
  const isExpanded = expandedTasks.has(task.id);
  const taskNumber = [...path, level].join(".");
  const indentStyle = { paddingLeft: `${path.length * 24 + 16}px` };

  // 💡 Función para formatear la moneda local (S/.)
  const formatBudget = (amount) => {
    const number = parseFloat(amount);
    return `S/ ${number.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="border-b border-gray-200">
      {/* Fila Principal */}
      <div className="grid grid-cols-[1fr_repeat(4,_8rem)_6rem] items-center py-3 hover:bg-gray-50 border-b">
        <div className="flex items-center space-x-2" style={indentStyle}>
          {hasSubtasks && (
            <button
              onClick={() => onToggleExpand(task.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          <span className="font-medium text-gray-900">
            {taskNumber}. {task.nombre}
          </span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(task.fecha_inicio), 'dd/MM/yy', { locale: es })}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(task.fecha_fin), 'dd/MM/yy', { locale: es })}
        </div>
        <div className="flex items-center">
          {formatBudget(task.presupuesto)}
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {task.asignaciones?.length || 0} miembros
        </div>
        <div className="flex justify-center">
          <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* Renderizado Recursivo de Subtareas */}
      {hasSubtasks && isExpanded && (
        <div>
          {task.subtareas.map((subtask, index) => (
            <TaskRow
              key={subtask.id}
              task={subtask}
              level={index + 1}
              path={[...path, level]}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedTasks={expandedTasks}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
