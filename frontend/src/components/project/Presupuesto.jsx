import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";

export default function Presupuesto({ projectId, onClose }) {
  const { tasks, fetchTasks } = useProjectStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (projectId) fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  useEffect(() => {
    const suma = tasks.reduce((acc, t) => acc + parseFloat(t.presupuesto || 0), 0);
    setTotal(suma);
  }, [tasks]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-10 p-6 animate-slide-up overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Presupuesto del Proyecto</h3>
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
                <th className="px-4 py-2 border text-left">Nombre de tarea</th>
                <th className="px-4 py-2 border text-right">Presupuesto (S/)</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{idx + 1}</td>
                  <td className="px-4 py-2 border">{task.nombre}</td>
                  <td className="px-4 py-2 border text-right">
                    S/ {parseFloat(task.presupuesto || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="px-4 py-2 border text-right">Total:</td>
                <td className="px-4 py-2 border text-right">S/ {total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
