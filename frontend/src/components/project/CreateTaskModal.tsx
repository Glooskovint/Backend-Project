import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar} from 'lucide-react';
import { apiService } from '../../services/api';
import { CreateTaskData } from '../../types';
import { useProjectStore } from '../../stores/projectStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentTaskId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
  parentTaskId,
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto: 0,
    parentId: parentTaskId ? Number(parentTaskId) : undefined,
    proyectoId: Number(projectId),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskData, string>>>({});

  const { addTask } = useProjectStore();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: apiService.createTask,
    onSuccess: (newTask) => {
      addTask(newTask);
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating task:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      presupuesto: 0,
      parentId: parentTaskId ? Number(parentTaskId) : undefined,
      proyectoId: Number(projectId),
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El título es requerido';
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

    if (formData.presupuesto && formData.presupuesto < 0) {
      newErrors.presupuesto = 'El presupuesto debe ser un valor positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      createTaskMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={parentTaskId ? 'Crear Subtarea' : 'Crear Nueva Actividad'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Título de la Actividad"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
          placeholder="Ingresa el título de la actividad"
          required
        />

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

        <Input
          label="Presupuesto (Opcional)"
          type="number"
          value={formData.presupuesto || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            presupuesto: e.target.value ? parseFloat(e.target.value) : 0 
          })}
          error={errors.presupuesto}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

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
            loading={createTaskMutation.isPending}
          >
            {parentTaskId ? 'Crear Subtarea' : 'Crear Actividad'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};