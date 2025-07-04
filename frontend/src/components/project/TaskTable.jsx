import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import TaskForm from './TaskForm'

export default function TaskTable({ projectId }) {
  const { tasks, fetchTasks, deleteTask } = useProjectStore()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState(new Set())

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId)
    }
  }, [projectId, fetchTasks])

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await deleteTask(taskId)
    }
  }

  const toggleExpand = (taskId) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const renderTask = (task, level = 0) => {
    const hasSubtasks = task.subtareas && task.subtareas.length > 0
    const isExpanded = expandedTasks.has(task.id)
    
    return (
      <div key={task.id}>
        <div className="flex items-center hover:bg-gray-50 transition-colors">
          <div className="table-cell" style={{ paddingLeft: `${level * 20 + 16}px` }}>
            <div className="flex items-center space-x-2">
              {hasSubtasks && (
                <button
                  onClick={() => toggleExpand(task.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
              <span className="font-medium text-gray-900">
                {level > 0 && `${level}.`} {task.nombre}
              </span>
            </div>
          </div>
          
          <div className="table-cell">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(task.fecha_inicio), 'dd/MM/yy', { locale: es })}
              </span>
            </div>
          </div>
          
          <div className="table-cell">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(task.fecha_fin), 'dd/MM/yy', { locale: es })}
              </span>
            </div>
          </div>
          
          <div className="table-cell">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>${parseFloat(task.presupuesto).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="table-cell">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{task.asignaciones?.length || 0} miembros</span>
            </div>
          </div>
          
          <div className="table-cell">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {hasSubtasks && isExpanded && (
          <div>
            {task.subtareas.map(subtask => renderTask(subtask, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Tabla de Actividades
        </h3>
        <button
          onClick={() => {
            setEditingTask(null)
            setShowForm(true)
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No hay tareas aún
          </h4>
          <p className="text-gray-600 mb-6">
            Crea la primera tarea para comenzar la planificación del proyecto
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Crear Primera Tarea
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="flex bg-gray-50 border-b border-gray-200">
                <div className="table-header flex-1">Tarea</div>
                <div className="table-header w-32">Inicio</div>
                <div className="table-header w-32">Fin</div>
                <div className="table-header w-32">Presupuesto</div>
                <div className="table-header w-32">Asignados</div>
                <div className="table-header w-24">Acciones</div>
              </div>
              
              {/* Body */}
              <div>
                {tasks.map(task => renderTask(task))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <TaskForm
          projectId={projectId}
          task={editingTask}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}