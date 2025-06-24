import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { useAuthStore } from '../stores/authStore'
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Users, 
  Share2, 
  Edit3,
  Plus,
  Table,
  BarChart3,
  Download,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import TaskTable from '../components/project/TaskTable'
import MembersPanel from '../components/project/MembersPanel'
import ObjectivesPanel from '../components/project/ObjectivesPanel'

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    currentProject, 
    loading, 
    fetchProject, 
    clearCurrentProject,
    getInviteLink 
  } = useProjectStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    if (id) {
      fetchProject(parseInt(id))
    }
    
    return () => {
      clearCurrentProject()
    }
  }, [id, fetchProject, clearCurrentProject])

  useEffect(() => {
    if (currentProject) {
      setEditData({
        titulo: currentProject.titulo,
        descripcion: currentProject.descripcion || '',
        objetivo_general: currentProject.objetivo_general || ''
      })
    }
  }, [currentProject])

  const handleShare = async () => {
    try {
      await getInviteLink(parseInt(id))
    } catch (error) {
      console.error('Error al compartir:', error)
    }
  }

  const handleSaveEdit = async () => {
    // Implementar actualización del proyecto
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Proyecto no encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const isOwner = user && currentProject.ownerId === user.firebase_uid

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a proyectos</span>
        </button>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.titulo}
                  onChange={(e) => setEditData({...editData, titulo: e.target.value})}
                  className="text-3xl font-bold bg-transparent border-b-2 border-primary-500 focus:outline-none w-full"
                />
                <div className="flex space-x-2">
                  <button onClick={handleSaveEdit} className="btn-primary text-sm">
                    Guardar
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="btn-secondary text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentProject.titulo}
                </h1>
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(currentProject.fecha_inicio), 'dd MMM yyyy', { locale: es })} - {' '}
                  {format(new Date(currentProject.fecha_fin), 'dd MMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>ID: {currentProject.id}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className="btn-outline flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir</span>
            </button>
            
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen', icon: FileText },
            { id: 'tasks', label: 'Tareas', icon: Table },
            { id: 'members', label: 'Miembros', icon: Users },
            { id: 'charts', label: 'Visualizaciones', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Project Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <span>Objetivo General</span>
                </h3>
                {isEditing ? (
                  <textarea
                    value={editData.objetivo_general}
                    onChange={(e) => setEditData({...editData, objetivo_general: e.target.value})}
                    className="input-field resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">
                    {currentProject.objetivo_general || 'No definido'}
                  </p>
                )}
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span>Descripción</span>
                </h3>
                {isEditing ? (
                  <textarea
                    value={editData.descripcion}
                    onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                    className="input-field resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">
                    {currentProject.descripcion || 'No hay descripción disponible'}
                  </p>
                )}
              </div>
            </div>

            {/* Objectives Panel */}
            <ObjectivesPanel projectId={parseInt(id)} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <TaskTable projectId={parseInt(id)} />
        )}

        {activeTab === 'members' && (
          <MembersPanel projectId={parseInt(id)} />
        )}

        {activeTab === 'charts' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visualizaciones del Proyecto
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Diagrama de Gantt</p>
              </button>
              <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Estructura de Tareas</p>
              </button>
              <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Matriz de Presupuestos</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}