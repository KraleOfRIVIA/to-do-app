import type { Metadata } from "next";
import { AddTaskDialog } from "@/components/task/add-task";
import { DashboardContent } from "@/components/task/dashboard-content";
import { TaskStatusStatsClient } from "@/components/task/task-status-client";
import { CompletedTasksClient } from "@/components/task/completed-tasks-client";

export const metadata: Metadata = {
  title: "Dashboard | Task Manager",
  description: "View your upcoming tasks, statistics, and completed tasks",
};

export default function DashboardPage() {
  return (
    <div className="p-6 min-h-screen bg-background">
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
          </div>
          <DashboardContent />
        </div>
        {/* Правая часть: Статистика и Completed */}
        <div className="flex flex-col gap-6">
          <TaskStatusStatsClient />
          <CompletedTasksClient />
        </div>
      </div>
    </div>
  );
}
