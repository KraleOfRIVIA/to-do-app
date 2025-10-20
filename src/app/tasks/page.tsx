"use client";

import { useEffect, useState } from "react";
import {useTaskStore } from "@/lib/store/task/task-store";
import { TaskCard } from "@/components/task/task-card";
import { AddTaskDialog } from "@/components/task/add-task";
import TargetTask from "@/components/task/target-task";
import Task from "@/types/ITask"

export default function TasksPage() {
  const { tasks, fetchAllTasks, loading } = useTaskStore();
const [targetTask, setTargetTask] = useState<Task | null>(null);
  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  return (
    <div className="p-6">
      <AddTaskDialog />
      {loading && <p>Loading tasks...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
        <div className="flex flex-col gap-4">
          {Array.isArray(tasks)
            ? tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setTargetTask(task)}
            />
          ))
        : null}
    </div>
    <div className="h-full">
      <TargetTask task={targetTask} />
    </div>
  </div>
</div>
  );
}
