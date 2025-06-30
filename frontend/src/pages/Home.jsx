import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { Plus, Calendar, Users, Target } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Home() {
  const { user } = useAuthStore()
  const { projects, loading, fetchProjects } = useProjectStore()

  useEffect(() => {
    if (user) {
      fetchProjects(user.firebase_uid)
    }
  }, [user, fetchProjects])

  console.log('User:', user)

  if (!user) {
    return (
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
              <Link to="/login" className="btn-primary text-lg px-8 py-3">
                Comenzar Ahora
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-3">
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
    )
  }

  return (
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
      ) : projects.length === 0 ? (
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}