import {
  CreateProjectData,
  CreateTaskData,
  CreateSpecificObjectiveData,
} from '../types';

const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Users
  async createUser(userData: { email: string; nombre: string; firebase_uid: string }) {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async getUser(firebase_uid: string) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${firebase_uid}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getUserByFirebaseUid(firebase_uid: string) {
    const response = await fetch(`${API_BASE_URL}/usuarios/firebase/${firebase_uid}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Projects
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/proyectos`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getProject(id: number) {
    const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createProject(projectData: CreateProjectData) {
    const response = await fetch(`${API_BASE_URL}/proyectos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  async updateProject(id: number, projectData: Partial<CreateProjectData>) {
    const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  async deleteProject(id: number) {
    const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async joinProjectByLink(inviteToken: string) {
    const response = await fetch(`${API_BASE_URL}/proyectos/join/${inviteToken}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getProjectByShareLink(inviteToken: string) {
    const response = await fetch(`${API_BASE_URL}/proyectos/share/${inviteToken}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Tasks
  async getTasks(projectId: number) {
    const response = await fetch(`${API_BASE_URL}/tareas/proyecto/${projectId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createTask(taskData: CreateTaskData) {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return response.json();
  }

  async updateTask(id: number, taskData: Partial<CreateTaskData>) {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return response.json();
  }

  async deleteTask(id: number) {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Task Assignments
  async assignTask(tareaId: number, usuarioId: string) {
    const response = await fetch(`${API_BASE_URL}/asignaciones`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ tareaId, usuarioId }),
    });
    return response.json();
  }

  async unassignTask(tareaId: number, usuarioId: string) {
    const response = await fetch(`${API_BASE_URL}/asignaciones/${tareaId}/${usuarioId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Objectives
  async getObjectives(projectId: number) {
    const response = await fetch(`${API_BASE_URL}/objetivos/proyecto/${projectId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createObjective(objectiveData: CreateSpecificObjectiveData) {
    const response = await fetch(`${API_BASE_URL}/objetivos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(objectiveData),
    });
    return response.json();
  }

  async updateObjective(id: number, objectiveData: Partial<CreateSpecificObjectiveData>) {
    const response = await fetch(`${API_BASE_URL}/objetivos/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(objectiveData),
    });
    return response.json();
  }

  async deleteObjective(id: number) {
    const response = await fetch(`${API_BASE_URL}/objetivos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
