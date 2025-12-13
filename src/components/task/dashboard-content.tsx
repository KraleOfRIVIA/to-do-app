"use client";

import { useTasksContext } from "@/components/providers/tasks-provider";
import TasksList from "@/components/task/tasks-list";

export function DashboardContent() {
  const { upcoming, isLoading: loading } = useTasksContext();

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return <TasksList tasks={upcoming} />;
}

