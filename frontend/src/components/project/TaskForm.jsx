import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { X, Calendar, DollarSign, FileText } from 'lucide-react'
import { format } from 'date-fns'

export default function TaskForm({ projectId, task, onClose }) {
  const { createTask, updateTask, tasks } = useProjectStore()
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
    fecha_fin: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    presupuesto: 0,
    parentId: null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        nombre: task.nombre,
        fecha_inicio: format(new Date(task.fecha_inicio), 'yyyy-MM-dd'),
        fecha_fin: format(new Date(task.fecha_fin), 'yyyy-MM-dd'),
        presupuesto: parseFloat(task.presupuesto),
        parentId: task.parentId
      })
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const taskData = {
        ...formData,
        proyectoId: projectId
      }

      if (task) {
        await updateTask(task.id, taskData)
      } else {
        await createTask(taskData)
      }
      
      onClose()
    } catch (error) {
      console.error('Error al guardar tarea:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'presupuesto' ? parseFloat(value) || 0 : 
               name === 'parentId' ? (value ? parseInt(value) : null) : value
    }))
  }

  // Filtrar tareas para el selector de tarea padre
  const availableParentTasks = tasks.filter(t => 
    !task || t.id !== task.id // No puede ser padre de sí misma
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Tarea *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Ej: Diseño de interfaz"
              />
            </div>
          </div>

          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
              Tarea Padre (Opcional)
            </label>
            <select
              id="parentId"
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Sin tarea padre</option>
              {availableParentTasks.map(parentTask => (
                <option key={parentTask.id} value={parentTask.id}>
                  {parentTask.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fecha_inicio"
                  name="fecha_inicio"
                  type="date"
                  required
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fecha_fin"
                  name="fecha_fin"
                  type="date"
                  required
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  min={formData.fecha_inicio}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="presupuesto" className="block text-sm font-medium text-gray-700 mb-2">
              Presupuesto
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="presupuesto"
                name="presupuesto"
                type="number"
                min="0"
                step="0.01"
                value={formData.presupuesto}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>{task ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}