import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateProjectForm from './CreateProjectForm';
import { X } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProjectCreated = (newProject) => {
    navigate(`/project/${newProject.id}`);
    onClose(); // Cerrar el modal después de la navegación
  };

  return (
    // Fondo del overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Contenedor del modal - bg-bg-card para fondo, text-text-main para texto general */}
      <div className="bg-bg-card p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-text-main">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-text-main">Crear Nuevo Proyecto</h2>
          {/* Botón de cerrar - text-text-secondary o text-text-main */}
          <button onClick={onClose} className="text-text-secondary hover:text-text-main">
            <X size={24} />
          </button>
        </div>
        <CreateProjectForm
          onProjectCreated={handleProjectCreated}
          onCancel={onClose} // Pasar la función onClose para el botón de cancelar del formulario
        />
      </div>
    </div>
  );
};

export default CreateProjectModal;
