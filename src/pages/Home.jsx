import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { Plus, Calendar, Users, Target } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Home = () => {
  const { user } = useAuthStore()
  const { projects, loading, fetchProjects } = useProjectStore()

  useEffect(() => {
    if (user) {
      fetchProjects(user.firebase_uid)
    }
  }, [user, fetchProjects])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gestión de Proyectos Colaborativa
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Planifica, organiza y colabora en tus proyectos con herramientas profesionales 
              de gestión de tareas, presupuestos y equipos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Planificación</h3>
              <p className="text-gray-600 text-sm">
                Organiza tareas con fechas, presupuestos y dependencias
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Colaboración</h3>
              <p className="text-gray-600 text-sm">
                Invita miembros y trabaja en tiempo real
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguimiento</h3>
              <p className="text-gray-600 text-sm">
                Visualiza el progreso con diagramas de Gantt
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary text-lg px-8 py-3">
              Comenzar Ahora
            </Link>
            <Link to="/create-project" className="btn-outline text-lg px-8 py-3">
              Ver Demo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, {user.nombre}
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus proyectos y colabora con tu equipo
            </p>
          </div>
          <Link to="/create-project" className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Nuevo Proyecto</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes proyectos aún
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer proyecto para comenzar a organizar tu trabajo
          </p>
          <Link to="/create-project" className="btn-primary">
            Crear Primer Proyecto
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {project.titulo}
                </h3>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              {project.descripcion && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.descripcion}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>
                    {format(new Date(project.fecha_inicio), 'dd MMM', { locale: es })} - 
                    {format(new Date(project.fecha_fin), 'dd MMM', { locale: es })}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>Equipo</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home