import { create } from 'zustand'
import { api } from '../services/api'
import { socketService } from '../services/socket'
import toast from 'react-hot-toast'

export const useProjectStore = create((set, get) => ({
  projects: [],
  sharedProjects: [],
  currentProject: null,
  tasks: [],
  members: [],
  loading: false,

  // Proyectos
  fetchProjects: async (ownerId) => {
    set({ loading: true })
    try {
      const projects = await api.getProjects(ownerId)
      set({ projects, loading: false })
    } catch (error) {
      console.error('Error al obtener proyectos:', error)
      set({ loading: false })
      toast.error('Error al cargar proyectos')
    }
  },

  fetchSharedProjects: async (userId) => {
    set({ loading: true })
    try {
      const sharedProjects = await api.getSharedProjects(userId)
      set({ sharedProjects, loading: false })
    } catch (error) {
      console.error('Error al obtener proyectos compartidos:', error)
      set({ loading: false })
      toast.error('Error al cargar proyectos compartidos')
    }
  },

  createProject: async (projectData) => {
    try {
      const newProject = await api.createProject(projectData)
      set(state => ({
        projects: [...state.projects, newProject]
      }))
      toast.success('Proyecto creado correctamente')
      return newProject
    } catch (error) {
      console.error('Error al crear proyecto:', error)
      toast.error('Error al crear proyecto')
      throw error
    }
  },

  fetchProject: async (id) => {
    set({ loading: true })
    try {
      const project = await api.getProject(id)
      set({ currentProject: project, loading: false })

      // Conectar a la sala del proyecto para actualizaciones en tiempo real
      socketService.joinProject(id)

      return project
    } catch (error) {
      console.error('Error al obtener proyecto:', error)
      set({ loading: false })
      toast.error('Error al cargar proyecto')
    }
  },

  updateProject: async (id, data) => {
    try {
      const updatedProject = await api.updateProject(id, data)
      set({ currentProject: updatedProject })

      // Emitir actualización en tiempo real
      socketService.editProjectTitle(id, data.titulo)

      toast.success('Proyecto actualizado')
      return updatedProject
    } catch (error) {
      console.error('Error al actualizar proyecto:', error)
      toast.error('Error al actualizar proyecto')
      throw error
    }
  },

  // Tareas
  fetchTasks: async (projectId) => {
    try {
      const tasks = await api.getTasks(projectId)
      set({ tasks })
    } catch (error) {
      console.error('Error al obtener tareas:', error)
      toast.error('Error al cargar tareas')
    }
  },

  createTask: async (taskData) => {
    try {
      const newTask = await api.createTask(taskData)
      set(state => ({
        tasks: [...state.tasks, newTask]
      }))
      toast.success('Tarea creada correctamente')
      return newTask
    } catch (error) {
      console.error('Error al crear tarea:', error)
      toast.error('Error al crear tarea')
      throw error
    }
  },

  updateTask: async (id, data) => {
    try {
      const updatedTask = await api.updateTask(id, data)
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? updatedTask : task
        )
      }))
      toast.success('Tarea actualizada')
      return updatedTask
    } catch (error) {
      console.error('Error al actualizar tarea:', error)
      toast.error('Error al actualizar tarea')
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await api.deleteTask(id)
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))
      toast.success('Tarea eliminada')
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
      toast.error('Error al eliminar tarea')
      throw error
    }
  },

  // Miembros
  fetchMembers: async (projectId) => {
    try {
      const members = await api.getProjectMembers(projectId)
      set({ members })
    } catch (error) {
      console.error('Error al obtener miembros:', error)
      toast.error('Error al cargar miembros')
    }
  },

  getInviteLink: async (projectId) => {
    try {
      const { token } = await api.getInviteLink(projectId)
      const inviteUrl = `${window.location.origin}/join/${token}`

      // Copiar al portapapeles
      await navigator.clipboard.writeText(inviteUrl)
      toast.success('Enlace de invitación copiado al portapapeles')

      return inviteUrl
    } catch (error) {
      console.error('Error al obtener enlace de invitación:', error)
      toast.error('Error al generar enlace de invitación')
      throw error
    }
  },

  joinProject: async (token, userId) => {
    try {
      const result = await api.joinProjectByToken(token, userId)
      toast.success('Te has unido al proyecto correctamente')
      return result
    } catch (error) {
      console.error('Error al unirse al proyecto:', error)
      toast.error('Error al unirse al proyecto: ' + error.message)
      throw error
    }
  },

  // Objetivos
  createObjective: async (objectiveData) => {
    try {
      const newObjective = await api.createObjective(objectiveData)
      toast.success('Objetivo creado correctamente')
      return newObjective
    } catch (error) {
      console.error('Error al crear objetivo:', error)
      toast.error('Error al crear objetivo')
      throw error
    }
  },

  getObjetives: async (projectId) => {
    try {
      const objectives = await api.getObjectivesByProject(projectId)
      return objectives
    } catch (error) {
      console.error('Error al obtener objetivos:', error)
      toast.error('Error al cargar objetivos')
      throw error
    }
  },

  updateObjective: async (id, data) => {
    try {
      const updatedObjective = await api.updateObjective(id, data)
      toast.success('Objetivo actualizado correctamente')
      return updatedObjective
    } catch (error) {
      console.error('Error al actualizar objetivo:', error)
      toast.error('Error al actualizar objetivo')
      throw error
    }
  },

  deleteObjective: async (id) => {
    try {
      await api.deleteObjective(id)
      toast.success('Objetivo eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar objetivo:', error)
      toast.error('Error al eliminar objetivo')
      throw error
    }
  },
  
  // Limpiar estado
  clearCurrentProject: () => {
    set({
      currentProject: null,
      tasks: [],
      members: []
    })
    socketService.disconnect()
  }
}))