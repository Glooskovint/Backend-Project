import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  Target,
  FileText,
  Table,
  BarChart3,
  Share2,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { apiService } from "../services/api";
import { useProjectStore } from "../stores/projectStore";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { TaskTable } from "../components/project/TaskTable";
import { useAuth } from "../hooks/useAuth";

type ViewMode = "overview" | "tasks" | "gantt" | "budget";

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const { currentProject, objectives, setCurrentProject, setObjectives } =
    useProjectStore();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", numericId],
    queryFn: () => apiService.getProject(numericId!),
    enabled: !!numericId && isAuthenticated,
  });

  const { data: projectObjectives = [] } = useQuery({
    queryKey: ["objectives", numericId],
    queryFn: () => apiService.getObjectives(numericId!),
    enabled: !!numericId && isAuthenticated,
  });

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project, setCurrentProject]);

  useEffect(() => {
    if (projectObjectives) {
      setObjectives(projectObjectives);
    }
  }, [projectObjectives, setObjectives]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (projectLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Proyecto no encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              El proyecto que buscas no existe o no tienes acceso a él.
            </p>
            <Button onClick={() => navigate("/")}>Volver al Inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/join/${currentProject.inviteToken}`;
    navigator.clipboard.writeText(shareUrl);
    // TODO: Show toast notification
  };

  const generalObjective = objectives.find((obj) => obj.tipo === "GENERAL");
  const specificObjectives = objectives.filter(
    (obj) => obj.tipo === "ESPECIFICO"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentProject.titulo}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {format(new Date(currentProject.fecha_inicio), "MMM d", {
                    locale: es,
                  })}{" "}
                  -{" "}
                  {format(new Date(currentProject.fecha_fin), "MMM d, yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{currentProject.miembros?.length || 0} miembros</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={Share2}
              onClick={copyShareLink}
            >
              Compartir
            </Button>
            <Button variant="outline" size="sm" icon={Download}>
              Exportar
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setViewMode("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Información General
            </button>
            <button
              onClick={() => setViewMode("tasks")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === "tasks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Table className="w-4 h-4 inline mr-2" />
              Actividades
            </button>
            <button
              onClick={() => setViewMode("gantt")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === "gantt"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Visualizaciones
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {viewMode === "overview" && (
        <div className="space-y-8">
          {/* Description */}
          {currentProject.descripcion && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Descripción del Proyecto
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{currentProject.descripcion}</p>
              </CardContent>
            </Card>
          )}

          {/* Objectives */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Objetivos
                </h3>
                <Button variant="outline" size="sm" icon={Target}>
                  Gestionar Objetivos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {generalObjective && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Objetivo General
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-1">
                        {generalObjective.titulo}
                      </h5>
                      {generalObjective.descripcion && (
                        <p className="text-blue-700 text-sm">
                          {generalObjective.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {specificObjectives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Objetivos Específicos
                    </h4>
                    <div className="space-y-3">
                      {specificObjectives.map((objective, index) => (
                        <div
                          key={objective.id}
                          className="bg-teal-50 border border-teal-200 rounded-lg p-4"
                        >
                          <h5 className="font-medium text-teal-900 mb-1">
                            {index + 1}. {objective.titulo}
                          </h5>
                          {objective.descripcion && (
                            <p className="text-teal-700 text-sm">
                              {objective.descripcion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {objectives.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No hay objetivos definidos aún
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Miembros del Equipo
                </h3>
                <Button variant="outline" size="sm" icon={Users}>
                  Gestionar Miembros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currentProject.miembros && currentProject.miembros.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentProject.miembros.map((member) => (
                    <div
                      key={member.usuarioId}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.usuario?.nombre?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.usuario?.nombre}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.usuario?.email}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            member.rol === "PROPIETARIO"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.rol === "PROPIETARIO"
                            ? "Propietario"
                            : "Miembro"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No hay miembros en el equipo aún
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === "tasks" && (
        <TaskTable projectId={currentProject.id} />
      )}

      {viewMode === "gantt" && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Visualizaciones Avanzadas
            </h3>
            <p className="text-gray-600 mb-6">
              Los diagramas de Gantt y otras visualizaciones estarán disponibles
              próximamente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
