import { useEffect } from "react";
import { X } from "lucide-react";
import { useProjectStore } from "../stores/projectStore";
import Nodo from "./Nodo";

export default function EDT({ projectId, onClose, isExportMode = false, containerId = "edt-chart-render-area-pdf" }) {
  const { tasks, fetchTasks, currentProject } = useProjectStore(state => ({
    tasks: state.tasks,
    fetchTasks: state.fetchTasks,
    // Ensure currentProject is available for its title, especially in export mode
    currentProject: state.currentProject,
  }));

  useEffect(() => {
    // Fetch tasks if projectId is provided, regardless of mode.
    // This is important if EDT is rendered directly for export without prior ProjectView loading.
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const tareasRaiz = tasks || []; // Fallback for initial render or if tasks aren't loaded yet
  // Attempt to get project title: from currentProject, or from tasks (if project info is embedded), or default
  const proyectoTitulo = currentProject?.titulo || tareasRaiz[0]?.proyecto?.titulo || "Proyecto";

  // Render content for PDF export
  if (isExportMode) {
    return (
      <div id={containerId} style={{ padding: '20px', backgroundColor: 'white', width: 'auto', display: 'inline-block' }}> {/* Ensure background for capture */}
        <div className="flex flex-col items-center space-y-8">
          {/* Nodo raíz */}
          <div className="bg-purple-600 text-white font-semibold px-6 py-3 rounded shadow-md text-center text-base">
            {proyectoTitulo}
          </div>

          {/* Tareas raíz */}
          {tareasRaiz.length > 0 ? (
            <div className="flex justify-center items-start gap-8 flex-wrap">
              {tareasRaiz.map((task) => (
                <Nodo key={task.id} task={task} nivel={1} />
              ))}
            </div>
          ) : (
            <p>No hay tareas para mostrar en el EDT.</p>
          )}
        </div>
      </div>
    );
  }

  // Default: Render as a modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-10 p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Diagrama de EDT
          </h3>
          {onClose && ( // Only show close button if onClose is provided
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* Nodo raíz */}
          <div className="bg-purple-600 text-white font-semibold px-6 py-3 rounded shadow-md text-center text-base">
            {proyectoTitulo}
          </div>

          {/* Tareas raíz */}
          {tareasRaiz.length > 0 ? (
            <div className="flex justify-center items-start gap-8 flex-wrap">
              {tareasRaiz.map((task) => (
                <Nodo key={task.id} task={task} nivel={1} />
              ))}
            </div>
          ) : (
             <p className="text-gray-600">No hay tareas para mostrar en el EDT.</p>
          )}
        </div>
      </div>
    </div>
  );
}
