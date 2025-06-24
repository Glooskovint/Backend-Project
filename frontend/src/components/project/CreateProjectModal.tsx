import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { CreateProjectData } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectData, string>>>({});

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectData) => apiService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }

    if (formData.fecha_inicio && formData.fecha_fin && new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      createProjectMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Proyecto" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Título del Proyecto"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          error={errors.titulo}
          placeholder="Ingresa el título del proyecto"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (Opcional)
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Describe brevemente el proyecto..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            error={errors.fecha_inicio}
            required
          />

          <Input
            label="Fecha de Fin"
            type="date"
            value={formData.fecha_fin}
            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
            error={errors.fecha_fin}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Calendar}
            loading={createProjectMutation.isPending}
          >
            Crear Proyecto
          </Button>
        </div>
      </form>
    </Modal>
  );
};