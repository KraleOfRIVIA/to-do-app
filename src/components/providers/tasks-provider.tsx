"use client";

import { useTasks, useUpcomingTasks } from "@/hooks/useTasks";
import { createContext, useContext, ReactNode } from "react";
import Task from "@/types/ITask";

type TasksContextType = {
  tasks: Task[];
  upcoming: Task[];
  isLoading: boolean;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingTasks();

  return (
    <TasksContext.Provider
      value={{
        tasks,
        upcoming,
        isLoading: tasksLoading || upcomingLoading,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  return context;
}

