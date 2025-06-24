import { useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { Target, Plus, Edit3, Trash2 } from 'lucide-react'

export default function ObjectivesPanel({ projectId }) {
  const { createObjective } = useProjectStore()
  const [objectives, setObjectives] = useState([
    { id: 1, descripcion: 'Objetivo específico 1', orden: 1 },
    { id: 2, descripcion: 'Objetivo específico 2', orden: 2 },
    { id: 3, descripcion: 'Objetivo específico 3', orden: 3 }
  ])
  const [showForm, setShowForm] = useState(false)
  const [newObjective, setNewObjective] = useState('')

  const handleAddObjective = async (e) => {
    e.preventDefault()
    if (!newObjective.trim()) return

    try {
      const objectiveData = {
        proyectoId: projectId,
        descripcion: newObjective,
        orden: objectives.length + 1
      }
      
      const created = await createObjective(objectiveData)
      setObjectives([...objectives, created])
      setNewObjective('')
      setShowForm(false)
    } catch (error) {
      console.error('Error al crear objetivo:', error)
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary-600" />
          <span>Objetivos Específicos</span>
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn-outline flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>

      <div className="space-y-4">
        {objectives.map((objective, index) => (
          <div
            key={objective.id}
            className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary-600">
                {index + 1}
              </span>
            </div>
            
            <div className="flex-1">
              <p className="text-gray-900">
                {objective.descripcion}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-500 hover:text-primary-600 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {showForm && (
          <form onSubmit={handleAddObjective} className="p-4 border-2 border-dashed border-primary-300 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-600">
                  {objectives.length + 1}
                </span>
              </div>
              
              <div className="flex-1">
                <textarea
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Describe el nuevo objetivo específico..."
                  autoFocus
                />
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setNewObjective('')
                    }}
                    className="btn-secondary text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-sm"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {objectives.length === 0 && !showForm && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No hay objetivos específicos definidos
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Agregar Primer Objetivo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}