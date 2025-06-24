import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Project } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/project/${project.id}`);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/join/${project.inviteToken}`;
    navigator.clipboard.writeText(shareUrl);
    // TODO: Show toast notification
  };

  return (
    <Card hover className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {project.titulo}
            </h3>
            
            {project.descripcion && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.descripcion}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {format(new Date(project.fecha_inicio), 'MMM d', { locale: es })} - {' '}
                  {format(new Date(project.fecha_fin), 'MMM d, yyyy', { locale: es })}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                <span>{project.miembros?.length || 0} miembros</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              size="sm"
              onClick={handleViewProject}
            >
              Ver Proyecto
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon={ExternalLink}
              onClick={copyShareLink}
            >
              Compartir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};