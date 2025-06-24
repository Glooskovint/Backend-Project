const API_BASE_URL = import.meta.env.VITE_API_URL

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Usuarios
  async createUser(userData) {
    return this.request('/usuarios', {
      method: 'POST',
      body: userData,
    })
  }

  async getUserByFirebaseUid(firebaseUid) {
    try {
      return await this.request(`/usuarios/firebase/${firebaseUid}`)
    } catch (error) {
      if (error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async getUsers() {
    return this.request('/usuarios')
  }

  // Proyectos
  async getProjects(ownerId) {
    const query = ownerId ? `?ownerId=${ownerId}` : ''
    return this.request(`/proyectos${query}`)
  }

  async getProject(id) {
    return this.request(`/proyectos/${id}`)
  }

  async createProject(projectData) {
    return this.request('/proyectos', {
      method: 'POST',
      body: projectData,
    })
  }

  async updateProject(id, data) {
    return this.request(`/proyectos/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async getProjectMembers(projectId) {
    return this.request(`/proyectos/${projectId}/miembros`)
  }

  async getInviteLink(projectId) {
    return this.request(`/proyectos/${projectId}/invite`)
  }

  async joinProjectByToken(token, userId) {
    return this.request(`/proyectos/join/${token}`, {
      method: 'POST',
      body: { userId },
    })
  }

  // Tareas
  async getTasks(projectId) {
    return this.request(`/tareas?proyectoId=${projectId}`)
  }

  async createTask(taskData) {
    return this.request('/tareas', {
      method: 'POST',
      body: taskData,
    })
  }

  async updateTask(id, data) {
    return this.request(`/tareas/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async deleteTask(id) {
    return this.request(`/tareas/${id}`, {
      method: 'DELETE',
    })
  }

  // Objetivos
  async createObjective(objectiveData) {
    return this.request('/objetivos', {
      method: 'POST',
      body: objectiveData,
    })
  }

  async updateObjective(id, data) {
    return this.request(`/objetivos/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async deleteObjective(id) {
    return this.request(`/objetivos/${id}`, {
      method: 'DELETE',
    })
  }

  // Asignaciones
  async createAssignment(assignmentData) {
    return this.request('/asignaciones', {
      method: 'POST',
      body: assignmentData,
    })
  }

  async deleteAssignment(tareaId, usuarioId) {
    return this.request(`/asignaciones/${tareaId}/${usuarioId}`, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiService()