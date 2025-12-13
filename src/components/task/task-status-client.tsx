"use client";

import { useTaskStats } from "@/hooks/useTasks";
import { TaskStatusStats } from "./task-status";

export function TaskStatusStatsClient() {
  const { data: taskStats, isLoading: statsLoading } = useTaskStats();

  if (statsLoading) {
    return <p>Loading task stats...</p>;
  }

  return (
    <TaskStatusStats
      completed={taskStats?.completed ?? 0}
      inProgress={taskStats?.inProgress ?? 0}
      notStarted={taskStats?.notStarted ?? 0}
    />
  );
}

