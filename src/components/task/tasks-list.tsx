"use client";
import { useState } from "react";
import Task from "@/types/ITask";
import { TaskCard } from "@/components/task/task-card";
import TargetTask from "@/components/task/target-task";
import { useTasksContext } from "@/components/providers/tasks-provider";

type TasksListProps = {
  tasks?: Task[];
  className?: string;
};

export default function TasksList({ tasks: tasksProp, className }: TasksListProps) {
    const { tasks: tasksFromContext } = useTasksContext();
    const tasks = tasksProp ?? tasksFromContext;
    const [targetTask, setTargetTask] = useState<Task | null>(null);
    
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px] ${className || ""}`}>
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
    );
}