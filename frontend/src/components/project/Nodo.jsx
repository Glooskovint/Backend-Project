import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Nodo({ task, nivel = 0 }) {
  const [expandido, setExpandido] = useState(true);
  const toggle = () => setExpandido(prev => !prev);

  const colores = [
    "bg-red-500",     // Nivel 0
    "bg-blue-500",    // Nivel 1
    "bg-orange-400",  // Nivel 2
    "bg-yellow-300",  // Nivel 3+
  ];
  const color = colores[nivel] || "bg-gray-400";

  const tieneHijos = task.subtareas?.length > 0;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Nodo actual */}
      <div className="flex items-center space-x-2">
        {tieneHijos && (
          <button onClick={toggle} className="text-gray-600 hover:text-black">
            {expandido ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        <div className={`text-white px-4 py-2 rounded shadow-md text-center font-semibold text-sm ${color}`}>
          {task.nombre}
          <div className="text-xs font-normal">
            {new Date(task.fecha_inicio).toLocaleDateString()} - {new Date(task.fecha_fin).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Subtareas */}
      {expandido && tieneHijos && (
        <div className="flex justify-center gap-6">
          {task.subtareas.map((sub) => (
            <Nodo key={sub.id} task={sub} nivel={nivel + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
