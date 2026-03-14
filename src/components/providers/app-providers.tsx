"use client";

import { SessionProvider } from "next-auth/react";
import { TasksProvider } from "@/components/providers/tasks-provider";
import { TaskDeadlineWatcher } from "@/components/notifications/notification";
import type Task from "@/types/ITask";

type AppProvidersProps = {
  children: React.ReactNode;
  initialTasks: Task[];
  initialUpcoming: Task[];
};

export function AppProviders({
  children,
  initialTasks,
  initialUpcoming,
}: AppProvidersProps) {
  return (
    <SessionProvider>
      <TasksProvider initialTasks={initialTasks} initialUpcoming={initialUpcoming}>
        <TaskDeadlineWatcher />
        {children}
      </TasksProvider>
    </SessionProvider>
  );
}
