import { create } from 'zustand';
import { supabase } from './supabase';

// Types
export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  user_id: string;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

interface TaskStore {
  tasks: Task[];
  projects: Project[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // Task actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // Project actions
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  // Auth actions
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useStore = create<TaskStore>((set, get) => ({
  tasks: [],
  projects: [],
  user: null,
  isLoading: false,
  error: null,

  // Task actions
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      set({ tasks: data || [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
      console.error('Error fetching tasks:', error);
    }
  },

  addTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select('*')
        .single();
      
      if (error) throw error;
      set((state) => ({
        tasks: [...state.tasks, data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add task', isLoading: false });
      console.error('Error adding task:', error);
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? data : task
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update task', isLoading: false });
      console.error('Error updating task:', error);
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
      console.error('Error deleting task:', error);
    }
  },

  // Project actions
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      set({ projects: data || [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
      console.error('Error fetching projects:', error);
    }
  },

  addProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select('*')
        .single();
      
      if (error) throw error;
      set((state) => ({
        projects: [...state.projects, data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add project', isLoading: false });
      console.error('Error adding project:', error);
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? data : project
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update project', isLoading: false });
      console.error('Error updating project:', error);
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        tasks: state.tasks.filter((task) => task.project_id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete project', isLoading: false });
      console.error('Error deleting project:', error);
    }
  },

  // Auth actions
  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      if (data.user) {
        set({ user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          avatar_url: data.user.user_metadata?.avatar_url || null
        }, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to sign up', isLoading: false });
      console.error('Error signing up:', error);
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      if (data.user) {
        set({ user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          avatar_url: data.user.user_metadata?.avatar_url || null
        }, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to sign in', isLoading: false });
      console.error('Error signing in:', error);
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, tasks: [], projects: [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to sign out', isLoading: false });
      console.error('Error signing out:', error);
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        set({ user: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || null
        }, isLoading: false });
        // Fetch tasks and projects after authentication
        await get().fetchTasks();
        await get().fetchProjects();
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to check auth', isLoading: false });
      console.error('Error checking auth:', error);
    }
  }
}));
