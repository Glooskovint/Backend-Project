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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Crear Nuevo Proyecto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
