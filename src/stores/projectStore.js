import { create } from 'zustand'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  
  fetchProjects: async (ownerId) => {
    set({ loading: true })
    try {
      const projects = await apiService.getProjects(ownerId)
      set({ projects, loading: false })
    } catch (error) {
      console.error('Error al obtener proyectos:', error)
      set({ loading: false })
      toast.error('Error al cargar proyectos')
    }
  },
  
  fetchProject: async (id) => {
    set({ loading: true })
    try {
      const project = await apiService.getProject(id)
      set({ currentProject: project, loading: false })
      return project
    } catch (error) {
      console.error('Error al obtener proyecto:', error)
      set({ loading: false })
      toast.error('Error al cargar proyecto')
      throw error
    }
  },
  
  createProject: async (projectData) => {
    try {
      const project = await apiService.createProject(projectData)
      set(state => ({ projects: [...state.projects, project] }))
      toast.success('Proyecto creado correctamente')
      return project
    } catch (error) {
      console.error('Error al crear proyecto:', error)
      toast.error('Error al crear proyecto')
      throw error
    }
  },
  
  updateProject: async (id, data) => {
    try {
      const updatedProject = await apiService.updateProject(id, data)
      set(state => ({
        projects: state.projects.map(p => p.id === id ? updatedProject : p),
        currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject
      }))
      toast.success('Proyecto actualizado')
      return updatedProject
    } catch (error) {
      console.error('Error al actualizar proyecto:', error)
      toast.error('Error al actualizar proyecto')
      throw error
    }
  },
  
  getInviteLink: async (projectId) => {
    try {
      const response = await apiService.getInviteLink(projectId)
      return response.token
    } catch (error) {
      console.error('Error al obtener enlace de invitación:', error)
      toast.error('Error al generar enlace de invitación')
      throw error
    }
  },
  
  joinProject: async (token, userId) => {
    try {
      const result = await apiService.joinProject(token, userId)
      toast.success('Te has unido al proyecto correctamente')
      return result
    } catch (error) {
      console.error('Error al unirse al proyecto:', error)
      toast.error('Error al unirse al proyecto')
      throw error
    }
  }
}))