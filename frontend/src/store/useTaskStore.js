import { create } from 'zustand';
import api from '../utils/api';

// Task statuses — canonical source of truth
export const STATUSES = {
  INBOX: 'inbox',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const STATUS_LABELS = {
  inbox: 'Inbox',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/tasks');
      set({ tasks: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      set((s) => ({ tasks: [data, ...s.tasks] }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  updateTask: async (id, updates) => {
    // Optimistic
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      set((s) => ({ tasks: s.tasks.map(t => t.id === id ? data : t) }));
    } catch {
      set({ tasks: prev });
    }
  },

  // Move a task to a new status bucket with one call
  moveTask: async (id, newStatus) => {
    const statusToCategory = {
      inbox: 'Inbox',
      'in-progress': 'In Progress',
      completed: 'Completed',
    };
    await get().updateTask(id, {
      status: newStatus,
      category: statusToCategory[newStatus],
      isCompleted: newStatus === 'completed',
    });
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      set({ tasks: prev });
    }
  },

  reorderTasks: async (batch) => {
    const prev = get().tasks;
    const map = new Map(batch.map(t => [t.id, t]));
    set((s) => ({
      tasks: s.tasks.map(t => map.has(t.id) ? { ...t, ...map.get(t.id) } : t)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }));
    try {
      const { data } = await api.put('/tasks/reorder/batch', { tasks: batch });
      set({ tasks: data });
    } catch {
      set({ tasks: prev });
    }
  },
}));

export default useTaskStore;
