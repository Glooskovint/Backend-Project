import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreateProjectForm from '../components/project/CreateProjectForm'; // Importar el nuevo componente

export default function CreateProject() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Proyecto</h1>
        <p className="text-gray-600 mt-2">
          Define los detalles básicos de tu proyecto para comenzar la planificación
        </p>
      </div>

      <div className="card animate-fade-in">
        <CreateProjectForm
          onProjectCreated={(newProject) => navigate(`/project/${newProject.id}`)}
          onCancel={() => navigate(-1)} // El formulario ahora tiene un botón de cancelar
        />
      </div>
    </div>
  )
}