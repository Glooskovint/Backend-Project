import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';

export default function Presupuesto({ projectId, onClose, isExportMode = false, containerId = "presupuesto-chart-render-area-pdf" }) {
  const { tasks, fetchTasks } = useProjectStore(state => ({
    tasks: state.tasks,
    fetchTasks: state.fetchTasks,
  }));
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [rootTasks, setRootTasks] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  useEffect(() => {
    const allTaskIds = new Set(tasks.map(t => t.id));
    const subtaskIds = new Set(
      tasks.flatMap(t => t.subtareas || []).map(s => s.id)
    );
    const roots = tasks.filter(t => !subtaskIds.has(t.id));
    setRootTasks(roots);

    const calcularTotal = (tasksList) => {
      return tasksList.reduce((acc, task) => {
        const totalTarea = parseFloat(task.presupuesto || 0);
        // Ensure subtareas is an array before calling reduce or calculating total
        const totalSubtareas = (task.subtareas && Array.isArray(task.subtareas)) ? calcularTotal(task.subtareas) : 0;
        return acc + totalTarea + totalSubtareas;
      }, 0);
    };

    setTotalGeneral(calcularTotal(tasks)); // Calculate total from all tasks for accuracy
  }, [tasks]);

  const renderTarea = (task, level = 0, path = []) => {
    const taskNumber = [...path, level + 1].join('.');
    // Ensure subtareas is an array before checking its length or mapping
    const tieneSubtareas = task.subtareas && Array.isArray(task.subtareas) && task.subtareas.length > 0;
    const paddingLeft = `${level * 15 + 5}px`; // Indent subtasks

    return (
      <React.Fragment key={task.id}>
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td className="px-4 py-2 border dark:border-gray-600 text-center align-top">{taskNumber}</td>
          <td style={{ paddingLeft }} className="px-4 py-2 border dark:border-gray-600 font-medium align-top text-text-main dark:text-text-main-dark">{task.nombre}</td>
          <td className="px-4 py-2 border dark:border-gray-600 text-right align-top text-text-secondary dark:text-text-secondary-dark">
            S/ {parseFloat(task.presupuesto || 0).toFixed(2)}
          </td>
        </tr>
        {tieneSubtareas &&
          task.subtareas.map((subtask, index) =>
            renderTarea(subtask, index, [...path, level + 1])
          )}
      </React.Fragment>
    );
  };

  const presupuestoTableContent = (
    <div
      className={`presupuesto-table-container ${isExportMode ? 'bg-white p-4' : 'overflow-x-auto'}`}
      id={isExportMode ? containerId : undefined}
      style={isExportMode ? { width: 'auto', display: 'inline-block' } : {}}
    >
      {!isExportMode && (
        <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Matriz de Presupuesto</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      <table className="min-w-full border border-gray-200 dark:border-gray-600 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="px-4 py-2 border dark:border-gray-600 w-16">#</th>
            <th className="px-4 py-2 border dark:border-gray-600 text-left">Nombre de Tarea</th>
            <th className="px-4 py-2 border dark:border-gray-600 text-right w-40">Presupuesto (S/)</th>
          </tr>
        </thead>
        <tbody className="text-text-main dark:text-text-main-dark">
          {rootTasks.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No hay tareas definidas con presupuesto.
              </td>
            </tr>
          ) : (
            rootTasks.map((task, idx) => renderTarea(task, idx, []))
          )}
          <tr className="bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-100">
            <td colSpan={2} className="px-4 py-2 border dark:border-gray-600 text-right">
              Total Proyecto:
            </td>
            <td className="px-4 py-2 border dark:border-gray-600 text-right">
              S/ {totalGeneral.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (isExportMode) {
    return presupuestoTableContent;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 my-10 p-6 animate-slide-up overflow-auto">
        {presupuestoTableContent}
      </div>
    </div>
  );
}