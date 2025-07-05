import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useProjectStore } from "../stores/projectStore";
import { Plus, Calendar, Users, Target } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Home() {
  const { user } = useAuthStore();
  const {
    projects,
    sharedProjects,
    loading,
    fetchProjects,
    fetchSharedProjects,
  } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProjects(user.firebase_uid);
      fetchSharedProjects(user.firebase_uid);
    }
  }, [user, fetchProjects, fetchSharedProjects]);

  // Botón siempre visible
  const handleCreateProject = () => {
    navigate("/create-project");
  };

  if (!user) {
    return (
      // Usar bg-bg-main para el fondo general
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            {/* Usar text-text-main y text-primary-600 para el título */}
            <h1 className="text-5xl font-bold text-text-main mb-6">
              Gestión de Proyectos
              <span className="text-primary-600"> Colaborativa</span>
            </h1>
            {/* Usar text-text-secondary para el párrafo */}
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Planifica, organiza y colabora en tus proyectos de manera
              eficiente. Gestiona tareas, objetivos y presupuestos en tiempo
              real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/login" className="btn-outline text-lg px-8 py-3">
                {" "}
                {/* btn-outline definido en index.css */}
                Iniciar Sesión
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {/* Las tarjetas ya usan la clase 'card' que fue actualizada en index.css (bg-bg-card) */}
              {/* Los textos dentro de las tarjetas necesitan ser ajustados */}
              <div className="card text-center">
                <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-text-main">
                  Objetivos Claros
                </h3>
                <p className="text-text-secondary">
                  Define objetivos generales y específicos para mantener el
                  enfoque del proyecto.
                </p>
              </div>

              <div className="card text-center">
                <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-text-main">
                  Planificación
                </h3>
                <p className="text-text-secondary">
                  Organiza tareas con fechas, presupuestos y dependencias
                  jerárquicas.
                </p>
              </div>

              <div className="card text-center">
                <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-text-main">
                  Colaboración
                </h3>
                <p className="text-text-secondary">
                  Invita miembros y colabora en tiempo real con actualizaciones
                  instantáneas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* Título y subtítulo de la sección de usuario logueado */}
          <h1 className="text-3xl font-bold text-text-main">Mis Proyectos</h1>
          <p className="text-text-secondary mt-2">
            Gestiona y colabora en tus proyectos
          </p>
        </div>

        <button
          onClick={handleCreateProject}
          className="btn-primary flex items-center space-x-2" // btn-primary
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading-spinner"></div>{" "}
          {/* Spinner ya actualizado en index.css */}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          {/* Tarjeta para "No tienes proyectos" */}
          <div className="card max-w-md mx-auto">
            {" "}
            {/* card usa bg-bg-card */}
            <Target className="w-16 h-16 text-text-secondary mx-auto mb-4" />{" "}
            {/* Icono más tenue */}
            <h3 className="text-xl font-semibold text-text-main mb-2">
              No tienes proyectos aún
            </h3>
            <p className="text-text-secondary mb-6">
              Crea tu primer proyecto para comenzar a planificar y colaborar.
            </p>
            <button onClick={handleCreateProject} className="btn-primary">
              Crear Primer Proyecto
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            // Tarjeta de proyecto
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="card hover:shadow-md transition-shadow duration-200 group" // card usa bg-bg-card
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-text-main group-hover:text-primary-600 transition-colors">
                  {project.titulo}
                </h3>
              </div>

              {project.descripcion && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {project.descripcion}
                </p>
              )}

              {/* Iconos y texto de fecha */}
              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(project.fecha_inicio), "dd MMM yyyy", {
                      locale: es,
                    })}{" "}
                    -{" "}
                    {format(new Date(project.fecha_fin), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
              </div>

              {/* Borde y texto "Ver detalles" */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-primary-600 font-medium">
                  Ver detalles →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {sharedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-main mb-4">
            Proyectos Compartidos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedProjects.map((project) => (
              // Tarjeta de proyecto compartido (similar a la anterior)
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="card hover:shadow-md transition-shadow duration-200 group" // card
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-text-main group-hover:text-primary-600 transition-colors">
                    {project.titulo}
                  </h3>
                  <span className="text-xs text-text-secondary bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Dueño: {project.owner?.nombre || "N/A"}
                  </span>
                </div>
                {project.descripcion && (
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {project.descripcion}
                  </p>
                )}
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(project.fecha_inicio), "dd MMM yyyy", {
                        locale: es,
                      })}{" "}
                      -{" "}
                      {format(new Date(project.fecha_fin), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-primary-600 font-medium">
                    Ver detalles →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
