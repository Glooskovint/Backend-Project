import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useProjectStore } from "../../stores/projectStore";
import { Calendar, FileText, Target } from "lucide-react";
import { format } from "date-fns";

const CreateProjectForm = ({ onProjectCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    objetivo_general: "",
    fecha_inicio: format(new Date(), "yyyy-MM-dd"),
    fecha_fin: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
  });
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore();
  const { createProject } = useProjectStore();
  const navigate = useNavigate(); // Aunque onProjectCreated maneja la navegación, puede ser útil para otros casos

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      // Esto no debería suceder si el flujo de UI es correcto, pero es una buena guarda
      setLoading(false);
      // Podríamos llamar a onCancel o mostrar un error específico
      console.error("Usuario no autenticado al intentar crear proyecto.");
      if (onCancel) onCancel();
      return;
    }

    try {
      const projectData = {
        ...formData,
        ...(user && { ownerId: user.firebase_uid }), // solo asigna ownerId si hay usuario
      };

      const newProject = await createProject(projectData);
      if (onProjectCreated) {
        onProjectCreated(newProject);
      } else {
        navigate(`/project/${newProject.id}`); // Fallback si no se provee onProjectCreated
      }
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      // Aquí se podría añadir un toast de error si no lo maneja ya `createProject`
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="titulo"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Título del Proyecto *
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            value={formData.titulo}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="Ej: Desarrollo de aplicación web"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
          className="input-field resize-none"
          placeholder="Describe brevemente el alcance y propósito del proyecto..."
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="objetivo_general"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Objetivo General
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            id="objetivo_general"
            name="objetivo_general"
            rows={3}
            value={formData.objetivo_general}
            onChange={handleChange}
            className="input-field pl-10 resize-none"
            placeholder="Define el objetivo principal que se busca alcanzar con este proyecto..."
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fecha_inicio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Inicio *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              required
              value={formData.fecha_inicio}
              onChange={handleChange}
              className="input-field pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="fecha_fin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Finalización *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              required
              value={formData.fecha_fin}
              onChange={handleChange}
              min={formData.fecha_inicio} // Evitar fecha de fin anterior a inicio
              className="input-field pl-10"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && ( // Mostrar botón de cancelar solo si se provee la función
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <div className="loading-spinner w-4 h-4"></div>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span>Crear Proyecto</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
