import React, { useMemo, useEffect, useState } from 'react';
import {
  format,
  eachDayOfInterval,
  parseISO,
  differenceInDays,
  isValid,
  startOfDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';

const DAY_COLUMN_WIDTH = 48;
const ROW_HEIGHT = 40;

export default function Gantt({ projectId, onClose }) {
  const { tasks, fetchTasks } = useProjectStore();
  const [rootTasks, setRootTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    if (projectId) fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  useEffect(() => {
    const allTaskIds = new Set(tasks.map(t => t.id));
    const subtaskIds = new Set(tasks.flatMap(t => t.subtareas || []).map(s => s.id));
    const root = tasks.filter(t => !subtaskIds.has(t.id));
    setRootTasks(root);
  }, [tasks]);

  const { dateRange, months } = useMemo(() => {
    if (!rootTasks.length) return { dateRange: [], months: [] };

    let minDate = null;
    let maxDate = null;

    const getAllDates = (tasksList) => {
      tasksList.forEach(task => {
        const startDate = parseISO(task.fecha_inicio);
        const endDate = parseISO(task.fecha_fin);

        if (!minDate || startDate < minDate) minDate = startDate;
        if (!maxDate || endDate > maxDate) maxDate = endDate;

        if (task.subtareas?.length) {
          getAllDates(task.subtareas);
        }
      });
    };

    getAllDates(rootTasks);

    if (!minDate || !maxDate) return { dateRange: [], months: [] };

    const range = eachDayOfInterval({ start: minDate, end: maxDate });

    const monthGroups = range.reduce((acc, date) => {
      const month = format(date, 'MMMM yyyy', { locale: es });
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {});

    const monthArray = Object.entries(monthGroups).map(([name, days]) => ({ name, days }));

    return { dateRange: range, months: monthArray };
  }, [rootTasks]);

  const today = startOfDay(new Date());

  const todayPosition = useMemo(() => {
    if (!dateRange.length) return null;
    const projectStart = dateRange[0];
    if (today < projectStart || today > dateRange[dateRange.length - 1]) return null;
    const daysFromStart = differenceInDays(today, projectStart);
    return daysFromStart * DAY_COLUMN_WIDTH;
  }, [dateRange, today]);

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  let rowCounter = 0;
  const renderAllTasks = () => {
    rowCounter = 0;
    const rows = [];

    const traverse = (task, level = 0, path = []) => {
      const rowIndex = rowCounter++;
      const taskNumber = [...path, level + 1].join('.');
      const startDate = parseISO(task.fecha_inicio);
      const endDate = parseISO(task.fecha_fin);

      if (!isValid(startDate) || !isValid(endDate)) return;

      const offsetDays = differenceInDays(startDate, dateRange[0]);
      const durationDays = differenceInDays(endDate, startDate) + 1;

      rows.push({
        id: task.id,
        nombre: task.nombre,
        taskNumber,
        rowIndex,
        left: offsetDays * DAY_COLUMN_WIDTH,
        width: durationDays * DAY_COLUMN_WIDTH,
        progress: task.progreso || 0,
        startDate,
        endDate,
        level,
        hasSubtasks: task.subtareas?.length > 0
      });

      if (expandedTasks[task.id]) {
        task.subtareas.forEach((subtask, idx) =>
          traverse(subtask, idx, [...path, level + 1])
        );
      }
    };

    rootTasks.forEach((task, idx) => traverse(task, idx));
    return rows;
  };

  const allRows = useMemo(() => renderAllTasks(), [rootTasks, expandedTasks, dateRange]);

  const getBarColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl flex flex-col animate-slide-up max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800">Diagrama de Gantt</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          <div className="grid" style={{ gridTemplateColumns: `250px 1fr` }}>
            {/* Leyenda izquierda */}
            <div className="sticky left-0 bg-white z-20">
              <div className="h-24 border-b border-r border-gray-200 bg-gray-50 flex items-end p-2">
                <h4 className="text-sm font-semibold text-gray-700">Tareas</h4>
              </div>
              <ul className="list-none m-0 p-0">
                {allRows.map(row => (
                  <li
                    key={row.id}
                    className="flex items-center border-b border-r border-gray-200 px-2 truncate"
                    style={{ height: `${ROW_HEIGHT}px`, paddingLeft: '12px' }}
                  >
                    {row.hasSubtasks && (
                      <button
                        onClick={() => toggleExpand(row.id)}
                        className="mr-1 text-xs text-gray-600 hover:text-black"
                      >
                        {expandedTasks[row.id] ? '▾' : '▸'}
                      </button>
                    )}
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {row.taskNumber}. {row.nombre}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cronología Gantt */}
            <div className="relative">
              <div className="sticky top-0 bg-white z-10">
                {/* Meses */}
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

                {/* Días */}
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

              {/* Grilla y barras */}
              <div className="relative" style={{ height: `${allRows.length * ROW_HEIGHT}px` }}>
                {/* Línea hoy */}
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

                {/* Barras */}
                {allRows.map(row => (
                  <div
                    key={row.id}
                    className="absolute left-0 right-0 border-b border-gray-200"
                    style={{
                      top: `${row.rowIndex * ROW_HEIGHT}px`,
                      height: `${ROW_HEIGHT}px`
                    }}
                  >
                    <div
                      className={`absolute top-2 bottom-2 ${getBarColor(row.progress)} rounded group flex items-center`}
                      style={{ left: `${row.left}px`, width: `${row.width}px` }}
                    >
                      <div
                        className="h-full bg-white bg-opacity-20 rounded"
                        style={{ width: `${row.progress}%` }}
                      />
                      <span className="absolute left-2 right-2 text-white text-xs font-semibold truncate group-hover:hidden">
                        {row.taskNumber}. {row.nombre}
                      </span>
                      <div className="absolute left-2 right-2 text-white text-xs font-semibold truncate hidden group-hover:block bg-black bg-opacity-70 p-1 rounded">
                        {format(row.startDate, 'dd/MM/yy')} - {format(row.endDate, 'dd/MM/yy')} ({row.progress}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
