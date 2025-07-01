import { useEffect, useState } from 'react' // Añadir useState
import { Link, useNavigate } from 'react-router-dom' // Añadir useNavigate
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { Plus, Calendar, Users, Target } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import CreateProjectModal from '../components/project/CreateProjectModal' // Importar el modal

export default function Home() {
  const { user } = useAuthStore()
  const { projects, loading, fetchProjects } = useProjectStore()
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    if (user && user.firebase_uid) { // Asegurarse que user.firebase_uid exista
      fetchProjects(user.firebase_uid)
    }
  }, [user, fetchProjects])

  const ownedProjects = projects.filter(p => p.ownerId === user?.firebase_uid);
  const sharedProjects = projects.filter(p => p.ownerId !== user?.firebase_uid);

  const handleStartNow = () => {
    if (user) {
      setIsCreateModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gestión de Proyectos
              <span className="text-primary-600"> Colaborativa</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Planifica, organiza y colabora en tus proyectos de manera eficiente. 
              Gestiona tareas, objetivos y presupuestos en tiempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleStartNow}
                className="btn-primary text-lg px-8 py-3"
              >
                Comenzar Ahora
              </button>
              <Link
                to="/login"
                className="btn-outline text-lg px-8 py-3"
              >
                Iniciar Sesión
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="card text-center">
                <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Objetivos Claros</h3>
                <p className="text-gray-600">
                  Define objetivos generales y específicos para mantener el enfoque del proyecto.
                </p>
              </div>
              
              <div className="card text-center">
                <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Planificación</h3>
                <p className="text-gray-600">
                  Organiza tareas con fechas, presupuestos y dependencias jerárquicas.
                </p>
              </div>
              
              <div className="card text-center">
                <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Colaboración</h3>
                <p className="text-gray-600">
                  Invita miembros y colabora en tiempo real con actualizaciones instantáneas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Renderizar el modal de creación de proyecto si el usuario está autenticado */}
      {/* Esto es para el caso en que el usuario esté en la landing page pero ya logueado (poco común pero posible) */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      </>
    )
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mis Proyectos
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona y colabora en tus proyectos
          </p>
        </div>
        
        <Link
          to="/create-project"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Proyecto</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      ) : (ownedProjects.length === 0 && sharedProjects.length === 0) ? (
        <div className="text-center py-12">
          <div className="card max-w-md mx-auto">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes proyectos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer proyecto para comenzar a planificar y colaborar.
            </p>
            <Link to="/create-project" className="btn-primary">
              Crear Primer Proyecto
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Sección Mis Proyectos */}
          {ownedProjects.length > 0 && (
            <div className="mb-12">
              {/* El título "Mis Proyectos" ya está arriba, así que no lo repetimos aquí salvo que se quiera un subtítulo */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Sección Proyectos Compartidos Conmigo */}
          {sharedProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Proyectos Compartidos Conmigo
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} isShared={true} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
    <CreateProjectModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
    />
    </>
  )
}

// Componente ProjectCard para reutilizar la lógica de visualización de tarjetas de proyecto
const ProjectCard = ({ project, isShared = false }) => {
  return (
    <Link
      key={project.id}
              to={`/project/${project.id}`}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {project.titulo}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  ID: {project.id}
                </span>
              </div>
              
              {project.descripcion && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.descripcion}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(project.fecha_inicio), 'dd MMM yyyy', { locale: es })} - {' '}
                    {format(new Date(project.fecha_fin), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-primary-600 font-medium">
                  Ver detalles →
                </span>
                {isShared && project.owner && (
                  <span className="block text-xs text-gray-400 mt-1">
                    Propietario: {project.owner.nombre || project.owner.email}
                  </span>
                )}
              </div>
            </Link>
  );
};