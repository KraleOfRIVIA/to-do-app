import { create } from "zustand";
import Task from "@/types/ITask";

type UIStore = {
  searchQuery: string;
  filteredTasks: Task[];
  setSearchQuery: (query: string) => void;
  searchTasks: (query: string, allTasks: Task[]) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  searchQuery: "",
  filteredTasks: [],

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchTasks: (query, allTasks) => {
    if (!query.trim()) {
      set({ filteredTasks: allTasks });
      return;
    }

    const filtered = allTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description?.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredTasks: filtered });
  },
}));

