import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { apiService } from "../../services/api";
import { socketService } from "../../services/socket";
import { Task } from "../../types";
import { useProjectStore } from "../../stores/projectStore";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { CreateTaskModal } from "./CreateTaskModal";

interface TaskTableProps {
  projectId: number;
}

export const TaskTable: React.FC<TaskTableProps> = ({ projectId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState<
    string | undefined
  >();
  const { tasks, setTasks, addTask, updateTask, removeTask } =
    useProjectStore();
  const queryClient = useQueryClient();

  const { data: tasksData = [], isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => apiService.getTasks(projectId),
    enabled: !!projectId,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: apiService.deleteTask,
    onSuccess: (_, deletedTaskId) => {
      removeTask(String(deletedTaskId));
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData, setTasks]);

  useEffect(() => {
    // Connect to socket for real-time updates
    const token = localStorage.getItem("authToken");
    if (token) {
      socketService.connect(token);
      socketService.joinProject(String(projectId));

      const handleTaskUpdate = (updatedTask: Task) => {
        updateTask(updatedTask);
      };

      const handleTaskCreated = (newTask: Task) => {
        addTask(newTask);
      };

      const handleTaskDeleted = (taskId: string) => {
        removeTask(taskId);
      };

      socketService.onTaskUpdate(handleTaskUpdate);
      socketService.onTaskCreated(handleTaskCreated);
      socketService.onTaskDeleted(handleTaskDeleted);

      return () => {
        socketService.offTaskUpdate(handleTaskUpdate);
        socketService.offTaskCreated(handleTaskCreated);
        socketService.offTaskDeleted(handleTaskDeleted);
        socketService.leaveProject(String(projectId));
      };
    }
  }, [projectId, updateTask, addTask, removeTask]);

  const handleCreateSubtask = (parentTaskId: string) => {
    setSelectedParentTask(parentTaskId);
    setShowCreateModal(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const renderTaskRow = (task: Task, level: number = 0) => {
    const indentClass = level > 0 ? `pl-${level * 4}` : "";

    return (
      <React.Fragment key={task.id}>
        <tr className="hover:bg-gray-50 border-b border-gray-200">
          <td className={`px-6 py-4 whitespace-nowrap ${indentClass}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {task.nombre}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              {format(new Date(task.fecha_inicio), "MMM d", { locale: es })}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              {format(new Date(task.fecha_fin), "MMM d", { locale: es })}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {task.presupuesto && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-400" />$
                {task.presupuesto.toLocaleString()}
              </div>
            )}
          </td>
          {/*<td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              task.estado === 'COMPLETADA'
                ? 'bg-green-100 text-green-800'
                : task.estado === 'EN_PROGRESO'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {task.estado === 'COMPLETADA' ? 'Completada' :
               task.estado === 'EN_PROGRESO' ? 'En Progreso' : 'Pendiente'}
            </span>
          </td>*/}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              {task.asignaciones?.map((assignment) => (
                <div
                  key={assignment.usuarioId}
                  className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                  title={assignment.usuario?.nombre}
                >
                  <span className="text-white text-xs font-medium">
                    {assignment.usuario?.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={() => handleCreateSubtask(String(task.id))}
              >
                Subtarea
              </Button>
              <Button variant="ghost" size="sm" icon={Edit2}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-600 hover:text-red-700"
              >
                Eliminar
              </Button>
            </div>
          </td>
        </tr>
        {task.subtareas?.map((childTask) =>
          renderTaskRow(childTask, level + 1)
        )}
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Organize tasks hierarchically
  const rootTasks = tasks.filter((task) => !task.parentId);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Tabla de Actividades
            </h3>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setSelectedParentTask(undefined);
                setShowCreateModal(true);
              }}
            >
              Nueva Actividad
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rootTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actividad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Inicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Fin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignados
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rootTasks.map((task) => renderTaskRow(task))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay actividades aún
              </h3>
              <p className="text-gray-600 mb-6">
                Crea la primera actividad para comenzar a organizar el proyecto.
              </p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setSelectedParentTask(undefined);
                  setShowCreateModal(true);
                }}
              >
                Crear Primera Actividad
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={String(projectId)}
        parentTaskId={selectedParentTask}
      />
    </>
  );
};
