import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Task from "@/types/ITask";

// Query keys
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  upcoming: () => [...taskKeys.all, "upcoming"] as const,
  completed: () => [...taskKeys.all, "completed"] as const,
  stats: () => [...taskKeys.all, "stats"] as const,
};

// Fetch all tasks
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async (): Promise<Task[]> => {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });
}

// Fetch upcoming tasks
export function useUpcomingTasks() {
  return useQuery({
    queryKey: taskKeys.upcoming(),
    queryFn: async (): Promise<Task[]> => {
      const res = await fetch("/api/tasks/upcoming");
      if (!res.ok) throw new Error("Failed to fetch upcoming tasks");
      return res.json();
    },
  });
}

// Fetch completed tasks
export function useCompletedTasks() {
  return useQuery({
    queryKey: taskKeys.completed(),
    queryFn: async (): Promise<Task[]> => {
      const res = await fetch("/api/tasks/completed");
      if (!res.ok) throw new Error("Failed to fetch completed tasks");
      return res.json();
    },
  });
}

// Fetch task stats
export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: async (): Promise<{
      completed: number;
      inProgress: number;
      notStarted: number;
    }> => {
      const res = await fetch("/api/tasks/status");
      if (!res.ok) throw new Error("Failed to fetch task stats");
      return res.json();
    },
  });
}

// Add task mutation
export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      task: Omit<Task, "id" | "createdAt">
    ): Promise<Task> => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to add task");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Update task mutation
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Omit<Task, "id" | "createdAt">>;
    }): Promise<Task> => {
      const res = await fetch(`/api/tasks/edit/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to update task");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Delete task mutation
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string): Promise<void> => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

