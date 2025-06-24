export interface User {
  firebase_uid: string;
  email: string;
  nombre: string;
  proyectosOwned?: Project[];
  proyectosCompartidos?: ProjectMember[];
  AsignacionTarea?: TaskAssignment[];
}

export interface Project {
  id: number;
  titulo: string;
  descripcion?: string;
  objetivo_general?: string;
  fecha_inicio: string;
  fecha_fin: string;
  ownerId?: string;
  inviteToken?: string;
  owner?: User;
  miembros?: ProjectMember[];
  ObjetivoEspecifico?: SpecificObjective[];
  Tarea?: Task[];
}

export interface ProjectMember {
  usuarioId: string;
  proyectoId: number;
  rol: 'PROPIETARIO' | 'MIEMBRO';
  usuario?: User;
  proyecto?: Project;
}

export interface SpecificObjective {
  id: number;
  descripcion: string;
  orden: number;
  proyectoId: number;
  proyecto?: Project;
}

export interface Task {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  presupuesto: number;
  proyectoId: number;
  parentId?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  proyecto?: Project;
  parent?: Task;
  subtareas?: Task[];
  asignaciones?: TaskAssignment[];
}

export interface TaskAssignment {
  tareaId: number;
  usuarioId: string;
  fecha_asignacion: string;
  tarea?: Task;
  usuario?: User;
}

// Datos para creación

export interface CreateProjectData {
  titulo: string;
  descripcion?: string;
  objetivo_general?: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface CreateTaskData {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  presupuesto: number;
  parentId?: number;
  proyectoId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export interface CreateSpecificObjectiveData {
  descripcion: string;
  orden: number;
  proyectoId: number;
}
