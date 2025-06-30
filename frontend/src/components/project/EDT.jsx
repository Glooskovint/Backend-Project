import { useEffect } from "react";
import { X } from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";
import Nodo from "./Nodo";

export default function EDT({ projectId, onClose }) {
  const { tasks, fetchTasks } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const tareasRaiz = tasks.filter(t => t.parentId === null);
  const proyectoTitulo = tasks[0]?.proyecto?.titulo || "Proyecto";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-10 p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Diagrama de EDT
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* Nodo raíz */}
          <div className="bg-purple-600 text-white font-semibold px-6 py-3 rounded shadow-md text-center text-base">
            {proyectoTitulo}
          </div>

          {/* Tareas raíz */}
          <div className="flex justify-center items-start gap-8 flex-wrap">
            {tareasRaiz.map((task) => (
              <Nodo key={task.id} task={task} nivel={1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
