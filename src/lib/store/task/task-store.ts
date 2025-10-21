import { create } from "zustand";
import Task from "@/types/ITask";

type TaskStore = {
  tasks: Task[];
  upcoming: Task[];
  completed: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  taskStats?: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  loading: boolean;

  // Метки времени кэша
  lastFetched?: number;

  // Методы
  fetchAllTasks: (force?: boolean) => Promise<void>;
  fetchUpcomingTasks: (force?: boolean) => Promise<void>;
  fetchTaskStats: (force?: boolean) => Promise<void>;
  fetchCompletedTasks: (force?: boolean) => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchTasks: (query: string) => void;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  upcoming: [],
  completed: [],
  taskStats: undefined,
  loading: false,
  lastFetched: undefined,
  filteredTasks: [],
  searchQuery: "",

  setSearchQuery: (query) => set({ searchQuery: query }),
  searchTasks: (query) => {
    const allTasks = get().tasks;
    if (!query.trim()) {
      set({ filteredTasks: allTasks });
      return;
    }

    const filtered = allTasks.filter((t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description?.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredTasks: filtered });
    console.log(filtered);
  },

  // 🧠 Оптимизированное получение всех задач с кэшированием
  fetchAllTasks: async (force = false) => {
    const { lastFetched, tasks } = get();
    const now = Date.now();

    // ⚙️ Кэширование: не запрашиваем, если прошло < 2 минут и force = false
    if (!force && tasks.length > 0 && lastFetched && now - lastFetched < 2 * 60 * 1000) {
      console.log("✅ Используем кэшированные задачи");
      return;
    }

    set({ loading: true });
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: data, lastFetched: now });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 📅 Будущие задачи
  fetchUpcomingTasks: async (force = false) => {
    if (!force && get().tasks.length > 0) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/tasks/upcoming");
      const data = await res.json();
      set({ upcoming: data });
    } catch (err) {
      console.error("Failed to fetch upcoming tasks:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 🧮 Статистика
  fetchTaskStats: async (force = false) => {
    if (!force && get().taskStats) return;

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

  // ✅ Завершённые задачи
  fetchCompletedTasks: async (force = false) => {
    if (!force && get().completed.length > 0) return;

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

  // ➕ Добавление задачи
  addTask: async (task) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const newTask = await res.json();
      if (res.ok && !newTask?.error) {
        set({
          tasks: [...(get().tasks ?? []), newTask],
          lastFetched: Date.now(),
        });
      } else {
        console.error("Failed to add task:", newTask?.error || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  },

  // 🗑️ Удаление
  removeTask: async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        set({
          tasks: get().tasks.filter((t) => t.id !== taskId),
          lastFetched: Date.now(),
        });
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  },

  // ✏️ Обновление
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
          tasks: get().tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          ),
          lastFetched: Date.now(),
        });
      } else {
        console.error("Failed to update task:", await res.json());
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  },
}));
