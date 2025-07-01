import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { X, Link } from 'lucide-react';

const JoinProjectModal = ({ isOpen, onClose }) => {
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { joinProject, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inviteLink.trim()) {
      toast.error('Por favor, pega un enlace de invitación.');
      return;
    }

    // Extraer el token del enlace. Asumimos que el enlace es como /join/:token
    const linkParts = inviteLink.split('/');
    const token = linkParts[linkParts.length - 1];

    if (!token) {
      toast.error('El enlace de invitación no parece válido.');
      return;
    }

    setIsLoading(true);
    try {
      await joinProject(token, user.firebase_uid);
      toast.success('Te has unido al proyecto exitosamente!');
      await fetchProjects(user.firebase_uid); // Recargar proyectos
      onClose();
      setInviteLink('');
    } catch (error) {
      // El toast de error ya se muestra en projectStore
      // toast.error(error.message || 'Error al unirse al proyecto.');
      console.error("Error al unirse al proyecto desde modal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Contenedor del modal - bg-bg-card y text-text-main */}
      <div className="bg-bg-card p-6 rounded-lg shadow-xl w-full max-w-md text-text-main">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-main">Unirse a un Proyecto</h2>
          {/* Botón de cerrar */}
          <button onClick={onClose} className="text-text-secondary hover:text-text-main">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* Label e icono del input */}
            <label htmlFor="inviteLink" className="block text-sm font-medium text-text-main mb-1">
              Enlace de Invitación
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-text-secondary" />
              </div>
              {/* Input - input-field y dark: variantes */}
              <input
                type="text"
                id="inviteLink"
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="Pega el enlace de invitación aquí"
                className="input-field pl-10 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {/* Botones - btn-secondary y btn-primary */}
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Uniéndose...' : 'Unirse al Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinProjectModal;
