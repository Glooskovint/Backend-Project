import { create } from 'zustand';
import { Project, Task, SpecificObjective } from '../types';

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  tasks: Task[];
  SpecificObjectives: SpecificObjective[];
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setSpecificObjectives: (SpecificObjectives: SpecificObjective[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  addSpecificObjective: (SpecificObjective: SpecificObjective) => void;
  updateSpecificObjective: (SpecificObjective: SpecificObjective) => void;
  removeSpecificObjective: (SpecificObjectiveId: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  projects: [],
  tasks: [],
  SpecificObjectives: [],
  setCurrentProject: (currentProject) => set({ currentProject }),
  setProjects: (projects) => set({ projects }),
  setTasks: (tasks) => set({ tasks }),
  setSpecificObjectives: (SpecificObjectives) => set({ SpecificObjectives }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => String(task.id) !== String(taskId)),
    })),
  addSpecificObjective: (SpecificObjective) =>
    set((state) => ({ SpecificObjectives: [...state.SpecificObjectives, SpecificObjective] })),
  updateSpecificObjective: (updatedSpecificObjective) =>
    set((state) => ({
      SpecificObjectives: state.SpecificObjectives.map((SpecificObjective) =>
        SpecificObjective.id === updatedSpecificObjective.id ? updatedSpecificObjective : SpecificObjective
      ),
    })),
  removeSpecificObjective: (SpecificObjectiveId) =>
    set((state) => ({
      SpecificObjectives: state.SpecificObjectives.filter((obj) => String(obj.id) !== String(SpecificObjectiveId)),
    })),
}));