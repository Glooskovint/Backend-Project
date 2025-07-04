import { useMemo, useEffect } from 'react';
import {
  format,
  eachDayOfInterval,
  parseISO,
  differenceInDays,
  isWithinInterval,
  isValid,
  startOfDay,
  getMonth,
  getYear
} from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';

// CONSTANTES PARA EL DISEÑO
const DAY_COLUMN_WIDTH = 48; // Ancho de cada columna de día en píxeles (igual a w-12 de Tailwind)
const ROW_HEIGHT = 40; // Alto de cada fila

export default function Gantt({ projectId, onClose }) {
  const { tasks, fetchTasks } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  // Rango de fechas y agrupación por meses para el encabezado
  const { dateRange, months } = useMemo(() => {
    if (tasks.length === 0 || !tasks[0]?.proyecto) {
      return { dateRange: [], months: [] };
    }

    const projectStartDate = parseISO(tasks[0].proyecto.fecha_inicio);
    const projectEndDate = parseISO(tasks[0].proyecto.fecha_fin);

    if (!isValid(projectStartDate) || !isValid(projectEndDate)) {
      return { dateRange: [], months: [] };
    }

    const range = eachDayOfInterval({
      start: projectStartDate,
      end: projectEndDate
    });

    // Agrupar por mes y año para el encabezado
    const monthGroups = range.reduce((acc, date) => {
      const month = format(date, 'MMMM yyyy', { locale: es });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {});

    const monthArray = Object.entries(monthGroups).map(([name, days]) => ({
      name,
      days
    }));

    return { dateRange: range, months: monthArray };
  }, [tasks]);

  const today = startOfDay(new Date());

  // Posición de la línea "Hoy"
  const todayPosition = useMemo(() => {
    if (dateRange.length === 0) return null;
    const projectStart = dateRange[0];
    if (today < projectStart || today > dateRange[dateRange.length - 1]) {
      return null;
    }
    const daysFromStart = differenceInDays(today, projectStart);
    return daysFromStart * DAY_COLUMN_WIDTH;
  }, [dateRange, today]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl flex flex-col animate-slide-up max-h-[90vh]">
        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800">
            Diagrama de Gantt
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenedor del Gantt con scroll */}
        <div className="flex-grow overflow-auto">
          <div className="grid" style={{ gridTemplateColumns: `250px 1fr` }}>
            {/* Columna de Nombres de Tareas (Fija) */}
            <div className="sticky left-0 bg-white z-20">
              <div className="h-24 border-b border-r border-gray-200 bg-gray-50 flex items-end p-2">
                 <h4 className="text-sm font-semibold text-gray-700">Tareas</h4>
              </div>
              <ul className="list-none m-0 p-0">
                {tasks.map(task => (
                  <li
                    key={task.id}
                    className="flex items-center border-b border-r border-gray-200 px-2 truncate"
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    <p className="text-sm text-gray-800 font-medium truncate">{task.nombre}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cronología del Gantt (Scrollable) */}
            <div className="relative">
              {/* Encabezado de la Cronología (Meses y Días) */}
              <div className="sticky top-0 bg-white z-10">
                {/* Fila de Meses */}
                <div className="flex border-b border-gray-200">
                  {months.map(({ name, days }) => (
                    <div
                      key={name}
                      className="text-center py-2 border-r border-gray-200"
                      style={{ width: `${days * DAY_COLUMN_WIDTH}px` }}
                    >
                      <span className="text-sm font-semibold text-gray-600 capitalize">{name}</span>
                    </div>
                  ))}
                </div>
                {/* Fila de Días */}
                <div className="flex bg-gray-50">
                   {dateRange.map((date, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 text-center border-r border-gray-200"
                      style={{ width: `${DAY_COLUMN_WIDTH}px` }}
                    >
                      <p className="text-xs text-gray-500">{format(date, 'E', { locale: es })}</p>
                      <p className="text-sm font-medium">{format(date, 'd')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grilla y Barras de Tareas */}
              <div className="relative">
                 {/* Línea de "Hoy" */}
                {todayPosition !== null && (
                  <div
                    className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10"
                    style={{ left: `${todayPosition}px` }}
                  >
                    <div className="absolute -top-1 -left-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      H
                    </div>
                  </div>
                )}
              
                {/* Filas de la grilla y barras de tareas */}
                {tasks.map((task, index) => {
                  const startDate = parseISO(task.fecha_inicio);
                  const endDate = parseISO(task.fecha_fin);

                  if (!isValid(startDate) || !isValid(endDate)) return null;

                  const offsetDays = differenceInDays(startDate, dateRange[0]);
                  const durationDays = differenceInDays(endDate, startDate) + 1;

                  const left = offsetDays * DAY_COLUMN_WIDTH;
                  const width = durationDays * DAY_COLUMN_WIDTH;
                  const progress = task.progreso || 0; // Asumiendo que la tarea tiene una propiedad 'progreso' (0-100)

                  return (
                    <div
                      key={task.id}
                      className="relative border-b border-gray-200"
                      style={{ height: `${ROW_HEIGHT}px` }}
                    >
                      {/* La barra de la tarea */}
                      <div
                        className="absolute top-2 bottom-2 bg-blue-500 rounded group flex items-center"
                        style={{ left: `${left}px`, width: `${width}px` }}
                      >
                         {/* Barra de progreso interior */}
                         <div
                           className="h-full bg-blue-700 rounded"
                           style={{ width: `${progress}%` }}
                         />
                         
                         {/* Nombre de la tarea sobre la barra */}
                         <span className="absolute left-2 right-2 text-white text-xs font-semibold truncate group-hover:hidden">
                            {task.nombre}
                         </span>

                         {/* Tooltip con detalles al hacer hover */}
                         <div className="absolute left-2 right-2 text-white text-xs font-semibold truncate hidden group-hover:block bg-black bg-opacity-70 p-1 rounded">
                           {format(startDate, 'dd/MM/yy')} - {format(endDate, 'dd/MM/yy')} ({progress}%)
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}