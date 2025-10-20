"use client";
import { AddTaskDialog } from "@/components/task/add-task";
import { CompletedTasks } from "@/components/task/completed-task";
import { TaskCard } from "@/components/task/task-card";
import { TaskStatusStats } from "@/components/task/task-status";
import { useTaskStore } from "@/lib/store/task/task-store";
import { useEffect } from "react";

export default function DashboardPage() {
    const { tasks, fetchUpcomingTasks, loading } = useTaskStore();
    const { taskStats, fetchTaskStats, loading: statsLoading } = useTaskStore();
    const { completed, fetchCompletedTasks } = useTaskStore();
  useEffect(() => {
    fetchUpcomingTasks();
    fetchTaskStats();
    fetchCompletedTasks();
  }, [fetchUpcomingTasks, fetchTaskStats, fetchCompletedTasks]);

  return (
    <div className="p-6 min-h-screen bg-background">
      {loading && <p>Loading tasks...</p>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая часть: To-Do */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-gray-400">📋</span>
              <span className="text-lg font-semibold text-red-400">To-Do</span>
              <AddTaskDialog />
            </div>
            <div className="text-gray-400 text-sm mb-4">20 June &nbsp; - &nbsp; Today</div>
            <div className="flex flex-col gap-4">
              {Array.isArray(tasks) ? tasks.map((task) => (
                <TaskCard key={task.id} task={task}  />
              )) : null}

            </div>
          </div>
        </div>
        {/* Правая часть: Статистика и Completed */}
        <div className="flex flex-col gap-6">
          {statsLoading && <p>Loading task stats...</p>}
          <TaskStatusStats
            completed={taskStats?.completed ?? 0}
            inProgress={taskStats?.inProgress ?? 0}
            notStarted={taskStats?.notStarted ?? 0}
          />
          <CompletedTasks tasks={completed} />
        </div>
      </div>
    </div>
  );
}