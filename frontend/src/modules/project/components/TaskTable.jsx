import { useState, useEffect, useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { Plus } from 'lucide-react';

import TaskForm from './TaskForm';
import TaskList from './TaskList'; // <-- Componente nuevo
import TaskEmptyState from './TaskEmptyState'; // <-- Componente nuevo

export default function TaskTable({ projectId }) {
  // El estado de la store sigue siendo la fuente de verdad
  const { tasks, fetchTasks, deleteTask } = useProjectStore();

  // Estados locales para la UI
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // useEffect para cargar las tareas iniciales
  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  // --- Handlers (Manejadores de eventos) ---

  // useCallback para evitar re-crear funciones innecesariamente
  const handleOpenForm = useCallback((task = null) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setEditingTask(null);
    setShowForm(false);
  }, []);

  // Se mantiene la lógica de eliminación aquí
  const handleDeleteTask = useCallback(async (taskId) => {
    // 💡 Mejora sugerida: Usar un componente modal en lugar de window.confirm
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await deleteTask(taskId);
    }
  }, [deleteTask]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Tabla de Actividades</h3>
        <button
          onClick={() => handleOpenForm()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <TaskEmptyState onNewTaskClick={() => handleOpenForm()} />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleOpenForm}
          onDelete={handleDeleteTask}
        />
      )}

      {showForm && (
        <TaskForm
          projectId={projectId}
          task={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}