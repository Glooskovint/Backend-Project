import { useMemo, useEffect } from 'react';
import {
  format,
  eachDayOfInterval,
  parseISO,
  differenceInDays,
  isWithinInterval,
  isValid
} from 'date-fns';
import { X } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';

export default function Gantt({ projectId, onClose }) {
  const { tasks, fetchTasks } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  // Rango de fechas total
  const allDates = useMemo(() => {
    const startDates = tasks.map(t =>
      isValid(parseISO(t.fecha_inicio)) ? parseISO(t.fecha_inicio) : new Date()
    );
    const endDates = tasks.map(t =>
      isValid(parseISO(t.fecha_fin)) ? parseISO(t.fecha_fin) : new Date()
    );

    const min = new Date(tasks[0]?.proyecto.fecha_inicio || new Date());
    const max = new Date(tasks[0]?.proyecto.fecha_fin || new Date());

    return eachDayOfInterval({ start: min, end: max });
  }, [tasks]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Diagrama de Gantt
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-auto border rounded-lg shadow-sm">
          <table className="min-w-max w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 p-2 text-left bg-gray-100 border">
                  Tarea
                </th>
                {allDates.map((date, i) => (
                  <th
                    key={i}
                    className="w-12 text-xs bg-gray-100 border text-center"
                  >
                    {format(date, 'dd/MM')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const fechaInicio = isValid(parseISO(task.fecha_inicio))
                  ? parseISO(task.fecha_inicio)
                  : null;
                const fechaFin = isValid(parseISO(task.fecha_fin))
                  ? parseISO(task.fecha_fin)
                  : null;

                return (
                  <tr key={task.id}>
                    <td className="p-2 border font-medium bg-white">
                      {task.nombre}
                    </td>
                    {allDates.map((date, i) => {
                      const isInRange =
                        fechaInicio &&
                        fechaFin &&
                        isWithinInterval(date, {
                          start: fechaInicio,
                          end: fechaFin
                        });

                      return (
                        <td key={i} className="border h-8 relative">
                          {isInRange && (
                            <div className="absolute inset-1 bg-blue-500 rounded-sm"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
