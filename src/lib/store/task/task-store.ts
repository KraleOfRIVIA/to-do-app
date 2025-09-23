import { create } from "zustand"

interface Task {
  id: string
  title: string
  description?: string
  priority: string
  status: string
  createdAt: string
  deadline?: string
}

interface TaskState {
  tasks: Task[]
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  fetchTasks: async () => {
    const res = await fetch("/api/tasks")
    const data = await res.json()
    set({ tasks: data })
  },
  addTask: async (task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
    const newTask = await res.json()
    set((state) => ({ tasks: [newTask, ...state.tasks] }))
  },
}))
