import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';

export default function MatrizPresupuesto({ projectId, onClose }) {
  const { tasks, fetchTasks } = useProjectStore();
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [rootTasks, setRootTasks] = useState([]);

  // Filtrar tareas raíz (que no son subtareas)
  useEffect(() => {
    if (projectId) fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  useEffect(() => {
    const allTaskIds = new Set(tasks.map(t => t.id));
    const subtaskIds = new Set(
      tasks.flatMap(t => t.subtareas || []).map(s => s.id)
    );
    const root = tasks.filter(t => !subtaskIds.has(t.id));
    setRootTasks(root);

    // Calcular total
    const calcularTotal = (tasksList) => {
      return tasksList.reduce((acc, task) => {
        const totalTarea = parseFloat(task.presupuesto || 0);
        const totalSubtareas = task.subtareas ? calcularTotal(task.subtareas) : 0;
        return acc + totalTarea + totalSubtareas;
      }, 0);
    };

    setTotalGeneral(calcularTotal(root));
  }, [tasks]);

  // Renderizado recursivo de la matriz
  const renderTarea = (task, level = 0, path = []) => {
    const taskNumber = [...path, level + 1].join('.');
    const tieneSubtareas = task.subtareas?.length > 0;

    return (
      <React.Fragment key={task.id}>
        {/* Fila de tarea */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-2 border text-center align-top">{taskNumber}</td>
          <td className="px-4 py-2 border font-medium align-top">{task.nombre}</td>
          <td className="px-4 py-2 border text-right align-top">
            S/ {parseFloat(task.presupuesto || 0).toFixed(2)}
          </td>
        </tr>

        {/* Subtareas recursivas */}
        {tieneSubtareas &&
          task.subtareas.map((subtask, index) =>
            renderTarea(subtask, index, [...path, level + 1])
          )}
      </React.Fragment>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-10 p-6 animate-slide-up overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Matriz de Presupuesto</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border text-left">Nombre de Tarea</th>
                <th className="px-4 py-2 border text-right">Presupuesto (S/)</th>
              </tr>
            </thead>
            <tbody>
              {rootTasks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    No hay tareas definidas.
                  </td>
                </tr>
              ) : (
                rootTasks.map((task, idx) => renderTarea(task, idx, []))
              )}

              {/* Total General */}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="px-4 py-2 border text-right">
                  Total Proyecto:
                </td>
                <td className="px-4 py-2 border text-right">
                  S/ {totalGeneral.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}