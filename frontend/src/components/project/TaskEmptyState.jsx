import { Calendar } from 'lucide-react';

export default function TaskEmptyState({ onNewTaskClick }) {
  return (
    <div className="card text-center py-12">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h4 className="text-lg font-semibold text-gray-900 mb-2">No hay tareas aún</h4>
      <p className="text-gray-600 mb-6">Crea la primera tarea para comenzar la planificación.</p>
      <button onClick={onNewTaskClick} className="btn-primary">
        Crear Primera Tarea
      </button>
    </div>
  );
}