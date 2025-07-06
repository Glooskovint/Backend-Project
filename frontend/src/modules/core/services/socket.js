import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_API_URL, {
        transports: ['websocket', 'polling']
      })

      this.socket.on('connect', () => {
        console.log('Conectado al servidor WebSocket')
        this.isConnected = true
      })

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor WebSocket')
        this.isConnected = false
      })

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión WebSocket:', error)
      })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinProject(projectId) {
    if (!this.socket) this.connect()
    this.socket.emit('joinProject', projectId)
  }

  editProjectTitle(projectId, nuevoTitulo) {
    if (this.socket && this.isConnected) {
      this.socket.emit('editProjectTitle', { projectId, nuevoTitulo })
    }
  }

  onProjectTitleUpdated(callback) {
    if (this.socket) {
      this.socket.on('projectTitleUpdated', callback)
    }
  }

  offProjectTitleUpdated() {
    if (this.socket) {
      this.socket.off('projectTitleUpdated')
    }
  }

  // Eventos para tareas en tiempo real
  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback)
    }
  }

  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('taskCreated', callback)
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('taskDeleted', callback)
    }
  }

  // Limpiar listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export const socketService = new SocketService()