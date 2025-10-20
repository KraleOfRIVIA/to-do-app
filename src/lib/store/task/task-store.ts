import { create } from "zustand";
import Task from "@/types/ITask"

type TaskStore = {
  tasks: Task[];
  completed: Task[];
  taskStats?: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  loading: boolean;
  fetchAllTasks: () => Promise<void>;
  fetchUpcomingTasks: () => Promise<void>;
  fetchTaskStats: () => Promise<void>;
  fetchCompletedTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  completed: [],
  taskStats: undefined,
  loading: false,

  fetchAllTasks: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: data });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchUpcomingTasks: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/tasks/upcoming");
      const data = await res.json();
      set({ tasks: data });
    } catch (err) {
      console.error("Failed to fetch upcoming tasks:", err);
    } finally {
      set({ loading: false });
    }   
  },
  addTask: async (task) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const newTask = await res.json();
      if (res.ok && newTask && !newTask.error) {
        set({ tasks: [...(get().tasks ?? []), newTask] });
      } else {
        console.error("Failed to add task:", newTask?.error || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  },
  fetchTaskStats: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/tasks/status");
      const data = await res.json();
      set({ taskStats: data });
    } catch (err) {
      console.error("Failed to fetch task stats:", err);
    } finally {
      set({ loading: false });
    }
  },
  removeTask: async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        set({ tasks: get().tasks.filter((t) => t.id !== taskId) });
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  },
  fetchCompletedTasks: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/tasks/completed");
      const data = await res.json();
      set({ completed: data });
    } catch (err) {
      console.error("Failed to fetch completed tasks:", err);
    } finally {
      set({ loading: false });
    }
  },
  updateTask: async (taskId, updates) => {
    try {
      const res = await fetch(`/api/tasks/edit/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        set({
          tasks: get().tasks.map((task) => (task.id === taskId ? updatedTask : task)),
        });
      } else {
        console.error("Failed to update task:", await res.json());
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  },
}));
