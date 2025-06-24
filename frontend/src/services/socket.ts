import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinProject(projectId: string) {
    this.socket?.emit('join_project', projectId);
  }

  leaveProject(projectId: string) {
    this.socket?.emit('leave_project', projectId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskUpdate(callback: (data: any) => void) {
    this.socket?.on('task_updated', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskCreated(callback: (data: any) => void) {
    this.socket?.on('task_created', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskDeleted(callback: (data: any) => void) {
    this.socket?.on('task_deleted', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProjectUpdate(callback: (data: any) => void) {
    this.socket?.on('project_updated', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offTaskUpdate(callback: (data: any) => void) {
    this.socket?.off('task_updated', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offTaskCreated(callback: (data: any) => void) {
    this.socket?.off('task_created', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offTaskDeleted(callback: (data: any) => void) {
    this.socket?.off('task_deleted', callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offProjectUpdate(callback: (data: any) => void) {
    this.socket?.off('project_updated', callback);
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();