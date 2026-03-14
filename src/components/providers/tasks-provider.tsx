"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type Task from "@/types/ITask";

type TasksContextType = {
  tasks: Task[];
  upcoming: Task[];
};

type TasksProviderProps = {
  children: ReactNode;
  initialTasks: Task[];
  initialUpcoming: Task[];
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({
  children,
  initialTasks,
  initialUpcoming,
}: TasksProviderProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [upcoming, setUpcoming] = useState(initialUpcoming);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    setUpcoming(initialUpcoming);
  }, [initialUpcoming]);

  const value = useMemo(
    () => ({
      tasks,
      upcoming,
    }),
    [tasks, upcoming]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  return context;
}
