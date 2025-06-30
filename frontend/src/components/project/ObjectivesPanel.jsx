import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { Target, Plus, Edit3, Trash2 } from 'lucide-react'

export default function ObjectivesPanel({ projectId }) {
  const {
    createObjective,
    updateObjective,
    deleteObjective,
    getObjetives
  } = useProjectStore()

  const [objectives, setObjectives] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newObjective, setNewObjective] = useState('')
  const [editIndex, setEditIndex] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [objectiveToDelete, setObjectiveToDelete] = useState(null)


  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const objectivesData = await getObjetives(projectId)
        setObjectives(objectivesData)
      } catch (error) {
        console.error('Error al cargar objetivos:', error)
      }
    }

    fetchObjectives()
  }, [projectId])

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

  const handleDelete = (id) => {
    setObjectiveToDelete(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteObjective(objectiveToDelete)
      setObjectives(objectives.filter(obj => obj.id !== objectiveToDelete))
      setShowConfirmModal(false)
      setObjectiveToDelete(null)
    } catch (error) {
      console.error('Error al eliminar objetivo:', error)
    }
  }

  const handleUpdate = async (e, index) => {
    e.preventDefault()

    try {
      const updatedObj = {
        ...objectives[index],
        descripcion: newObjective
      }

      await updateObjective(updatedObj.id, updatedObj)

      const updatedObjectives = [...objectives]
      updatedObjectives[index] = updatedObj
      setObjectives(updatedObjectives)
      setEditIndex(null)
    } catch (error) {
      console.error('Error al actualizar objetivo:', error)
    }
  }

  return (
    <>
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro?</h2>
            <p className="text-gray-600 mb-6">Esta acción eliminará el objetivo. ¿Deseas continuar?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setObjectiveToDelete(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
          {objectives.map((objective, index) =>
            editIndex === index ? (
              <form
                key={`edit-${index}`}
                onSubmit={(e) => handleUpdate(e, index)}
                className="p-4 border-2 border-dashed border-primary-300 rounded-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary-600">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <textarea
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      className="input-field resize-none"
                      rows={2}
                      placeholder="Edita el objetivo específico..."
                      autoFocus
                    />

                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditIndex(null)
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
                        Actualizar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
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
                  <p className="text-gray-900">{objective.descripcion}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                    onClick={() => {
                      setEditIndex(index)
                      setNewObjective(objective.descripcion)
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(objective.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}

          {showForm && (
            <form
              onSubmit={handleAddObjective}
              className="p-4 border-2 border-dashed border-primary-300 rounded-lg"
            >
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
    </>
  )
}
