import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderPlus, Briefcase, Users, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ProjectCard } from '../components/project/ProjectCard';
import { CreateProjectModal } from '../components/project/CreateProjectModal';
import { Project } from '../types';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: apiService.getProjects,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gestiona tus proyectos
              <span className="text-blue-600 block">de forma colaborativa</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Planifica, organiza y ejecuta proyectos en equipo con herramientas profesionales. 
              Desde la gestión de tareas hasta presupuestos y diagramas de Gantt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={FolderPlus}
                onClick={() => setShowCreateModal(true)}
              >
                Crear Proyecto
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/login'}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gestión Completa
                </h3>
                <p className="text-gray-600">
                  Administra objetivos, tareas, presupuestos y cronogramas en una sola plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Colaboración en Tiempo Real
                </h3>
                <p className="text-gray-600">
                  Trabaja con tu equipo en tiempo real con actualizaciones instantáneas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Visualizaciones Avanzadas
                </h3>
                <p className="text-gray-600">
                  Diagramas de Gantt, matrices de presupuesto y estructuras de trabajo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-gray-600">
          Gestiona y colabora en tus proyectos
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Mis Proyectos ({projects.length})
        </h2>
        <Button
          variant="primary"
          icon={FolderPlus}
          onClick={() => setShowCreateModal(true)}
        >
          Nuevo Proyecto
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes proyectos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer proyecto para comenzar a colaborar con tu equipo.
            </p>
            <Button
              variant="primary"
              icon={FolderPlus}
              onClick={() => setShowCreateModal(true)}
            >
              Crear Primer Proyecto
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};