"use client";

import { useCompletedTasks } from "@/hooks/useTasks";
import { CompletedTasks } from "./completed-task";

export function CompletedTasksClient() {
  const { data: completed = [] } = useCompletedTasks();
  return <CompletedTasks tasks={completed} />;
}

