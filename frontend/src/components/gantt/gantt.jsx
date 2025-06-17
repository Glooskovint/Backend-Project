import { useEffect, useState } from "react";

export default function Gantt({ tasks }) {
  const [ganttData, setGanttData] = useState([]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
        const data = tasks.map(t => ({
    id: t.id.toString(),
    name: t.nombre,
    start: new Date(t.fecha_inicio),
    end: new Date(t.fecha_fin),
    progress: t.metadata?.progreso ?? 0,
    dependencies: t.parentId ? [t.parentId.toString()] : []
    }));
      setGanttData(data);
    }
  }, [tasks]);

  // Calcular fechas mínimas y máximas para crear una escala de días
  const allDates = ganttData.flatMap(task => [task.start, task.end]);
  const minDate = allDates.length ? new Date(Math.min(...allDates)) : new Date();
  const maxDate = allDates.length ? new Date(Math.max(...allDates)) : new Date();

  const totalDays =
    Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

  const getBarStyle = (start, end) => {
    const startOffset = Math.floor((start - minDate) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return {
      marginLeft: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
      backgroundColor: "#4caf50",
      height: "20px",
      borderRadius: "4px"
    };
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <h3>DIAGRAMA DE GANTT</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Tarea</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Inicio</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Fin</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Barra</th>
          </tr>
        </thead>
        <tbody>
          {ganttData.map(task => (
            <tr key={task.id}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{task.name}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {task.start.toLocaleDateString()}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {task.end.toLocaleDateString()}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd", position: "relative" }}>
                <div style={{ position: "relative", height: "20px", backgroundColor: "#eee" }}>
                  <div style={getBarStyle(task.end, task.start)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
