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
  Table,
  BarChart3,
  Download,
  FileText,
  Loader2 // Importar el ícono de carga
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import TaskTable from '../components/project/TaskTable'
import MembersPanel from '../components/project/MembersPanel'
import ObjectivesPanel from '../components/project/ObjectivesPanel'
import Gantt from '../components/project/Gantt'
import EDT from '../components/project/EDT'
import Presupuesto from '../components/project/Presupuesto'
import ProjectExportPDF from '../components/project/ProjectExportPDF' // Importar el componente de exportación

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    currentProject, 
    loading, 
    fetchProject, 
    clearCurrentProject,
    getInviteLink,
    updateProject
  } = useProjectStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [ showGantt, setShowGantt ] = useState(false)
  const [ showEDT, setShowEDT ] = useState(false)
  const [showPresupuesto, setShowPresupuesto] = useState(false)
  const [isExporting, setIsExporting] = useState(false) // Estado para controlar la exportación
  const [showExportComponent, setShowExportComponent] = useState(false) // Estado para montar el componente de PDF

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
    setIsEditing(false)
    try {
      await updateProject(
        parseInt(id), // ID del proyecto
        {
          titulo: editData.titulo,
          descripcion: editData.descripcion,
          objetivo_general: editData.objetivo_general,
        }
      );
      // Optionally, you can show a success message here
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      // Optionally, show an error message to the user
    }
  }

  const handleShowGantt = () => {
    setShowGantt(true)
  }

  const handleShowEDT = () => {
    setShowEDT(true)
  }

  const handleShowPresupuesto = () => {
    setShowPresupuesto(true)
  }

  const handleExportPDF = () => {
    if (!currentProject) return;
    setIsExporting(true);
    setShowExportComponent(true);
    // El componente ProjectExportPDF se encargará de la lógica de generación
    // y se desmontará después a través de onExportFinish
  }

  const onPDFExportFinish = (success) => {
    setShowExportComponent(false); // Desmontar el componente ProjectExportPDF
    setIsExporting(false);
    if (success) {
      // Podrías mostrar una notificación de éxito aquí
      console.log("PDF exportado con éxito");
    } else {
      // Podrías mostrar una notificación de error aquí
      console.error("Error al exportar PDF");
    }
  }

  if (loading) {
    return (
      // Spinner ya actualizado en index.css
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-bg-main text-text-main">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-main mb-4">
            Proyecto no encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary" // btn-primary
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const isOwner = user && currentProject.ownerId === user.firebase_uid

  return (
  <>
    {showGantt && <Gantt projectId={id} onClose={() => setShowGantt(false)} />}
    {showEDT && <EDT projectId={id} onClose={() => setShowEDT(false)} />}
    {showPresupuesto && <Presupuesto projectId={id} onClose={() => setShowPresupuesto(false)} />}

    {/* Componente de exportación a PDF (se monta cuando es necesario) */}
    {showExportComponent && currentProject && (
      <ProjectExportPDF
        project={currentProject}
        onExportFinish={onPDFExportFinish}
      />
    )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-text-main">
      {/* Header */}
      <div className="mb-8">
        {/* Botón "Volver" */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-main transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a proyectos</span>
        </button>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                {/* Input de edición de título */}
                <input
                  type="text"
                  value={editData.titulo}
                  onChange={(e) => setEditData({...editData, titulo: e.target.value})}
                  className="text-3xl font-bold bg-transparent border-b-2 border-primary-500 focus:outline-none w-full text-text-main placeholder-text-secondary"
                />
                <div className="flex space-x-2">
                  <button onClick={handleSaveEdit} className="btn-primary text-sm"> {/* btn-primary */}
                    Guardar
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="btn-secondary text-sm" // btn-secondary
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Título del proyecto */}
                <h1 className="text-3xl font-bold text-text-main">
                  {currentProject.titulo}
                </h1>
                {isOwner && (
                  // Botón de editar
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-text-secondary hover:text-text-main transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            
            {/* Fechas y dueño */}
            <div className="flex items-center space-x-6 mt-4 text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(currentProject.fecha_inicio), 'dd MMM yyyy', { locale: es })} - {' '}
                  {format(new Date(currentProject.fecha_fin), 'dd MMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Dueño: {currentProject.owner?.nombre || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {/* Botones Compartir y Exportar */}
            <button
              onClick={handleShare}
              className="btn-outline flex items-center space-x-2" // btn-outline
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir</span>
            </button>
            
            <button
              onClick={handleExportPDF}
              className="btn-secondary flex items-center space-x-2" // btn-secondary
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Exportando...' : 'Exportar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Bordes y texto de pestañas */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen', icon: FileText },
            { id: 'tasks', label: 'Tareas', icon: Table },
            { id: 'charts', label: 'Visualizaciones', icon: BarChart3 },
            { id: 'members', label: 'Miembros', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600' // Color primario para activa
                  : 'border-transparent text-text-secondary hover:text-text-main hover:border-gray-300 dark:hover:border-gray-600' // Colores semánticos para inactivas
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
            {/* Project Info Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tarjeta Objetivo General - card usa bg-bg-card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <span>Objetivo General</span>
                </h3>
                {isEditing ? (
                  // Textarea - input-field ya tiene estilos base, agregar dark:
                  <textarea
                    value={editData.objetivo_general}
                    onChange={(e) => setEditData({...editData, objetivo_general: e.target.value})}
                    className="input-field resize-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    rows={4}
                  />
                ) : (
                  <p className="text-text-secondary">
                    {currentProject.objetivo_general || 'No definido'}
                  </p>
                )}
              </div>
              
              {/* Tarjeta Descripción - card usa bg-bg-card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span>Descripción</span>
                </h3>
                {isEditing ? (
                  // Textarea - input-field
                  <textarea
                    value={editData.descripcion}
                    onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                    className="input-field resize-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    rows={4}
                  />
                ) : (
                  <p className="text-text-secondary">
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
          // Tarjeta Visualizaciones - card usa bg-bg-card
          <div className="card">
            <h3 className="text-lg font-semibold text-text-main mb-4">
              Visualizaciones del Proyecto
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Botones para visualizaciones - ajustar bordes y texto */}
              <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors"
                onClick={handleShowGantt}
              >
                <BarChart3 className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">Diagrama de Gantt</p>
              </button>
              <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors"
                onClick={handleShowEDT}>
                <Target className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">Estructura de Desglose de Tareas</p>
              </button>
              <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors"
              onClick={handleShowPresupuesto}>
                <FileText className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">Matriz de Presupuestos</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  )
}