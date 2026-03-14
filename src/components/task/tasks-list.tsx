"use client";

import { useMemo, useState } from "react";
import { ListTodo } from "lucide-react";
import { useTranslations } from "next-intl";
import Task from "@/types/ITask";
import { TaskCard } from "@/components/task/task-card";
import TargetTask from "@/components/task/target-task";
import { useTasksContext } from "@/components/providers/tasks-provider";
import { cn } from "@/lib/utils";

type TasksListProps = {
  tasks?: Task[];
  className?: string;
  listTitle?: string;
  listDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function TasksList({
  tasks: tasksProp,
  className,
  listTitle,
  listDescription,
  emptyTitle,
  emptyDescription,
}: TasksListProps) {
  const t = useTranslations("TasksList");
  const { tasks: tasksFromContext } = useTasksContext();
  const tasks = useMemo(() => tasksProp ?? tasksFromContext, [tasksProp, tasksFromContext]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const resolvedListTitle = listTitle ?? t("listTitle");
  const resolvedListDescription = listDescription ?? t("listDescription");
  const resolvedEmptyTitle = emptyTitle ?? t("emptyTitle");
  const resolvedEmptyDescription = emptyDescription ?? t("emptyDescription");

  const selectedTask = useMemo(() => {
    if (tasks.length === 0) {
      return null;
    }

    const activeId = selectedTaskId ?? tasks[0].id;
    return tasks.find((task) => task.id === activeId) ?? tasks[0];
  }, [selectedTaskId, tasks]);

  return (
    <div className={cn("grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]", className)}>
      <section className="rounded-xl border bg-background/60 p-4">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">{resolvedListTitle}</h3>
            <p className="text-sm text-muted-foreground">{resolvedListDescription}</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </header>

        {tasks.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-4 text-center">
            <ListTodo className="mb-3 size-5 text-muted-foreground" />
            <p className="text-sm font-medium">{resolvedEmptyTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{resolvedEmptyDescription}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  isActive={selectedTask?.id === task.id}
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <TargetTask task={selectedTask} />
      </aside>
    </div>
  );
}
