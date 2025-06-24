import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
      })

      this.socket.on('connect', () => {
        console.log('Conectado al servidor WebSocket')
      })

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor WebSocket')
      })
    }
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinProject(projectId) {
    if (this.socket) {
      this.socket.emit('joinProject', projectId)
    }
  }

  editProjectTitle(projectId, nuevoTitulo) {
    if (this.socket) {
      this.socket.emit('editProjectTitle', { projectId, nuevoTitulo })
    }
  }

  onProjectTitleUpdated(callback) {
    if (this.socket) {
      this.socket.on('projectTitleUpdated', callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export const socketService = new SocketService()