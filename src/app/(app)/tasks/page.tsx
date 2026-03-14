import type { Metadata } from "next";
import { CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { AddTaskDialog } from "@/components/task/add-task";
import TasksList from "@/components/task/tasks-list";
import { getTaskSnapshot } from "@/lib/tasks/task-queries";

export const metadata: Metadata = {
  title: "My Tasks | Task Manager",
  description: "View and manage all your tasks",
};

export default async function TasksPage() {
  const t = await getTranslations("TasksPage");
  const snapshot = await getTaskSnapshot();

  const summary = snapshot.tasks.reduce(
    (acc, task) => {
      if (task.status === "Completed") acc.completed += 1;
      if (task.status === "In Progress") acc.inProgress += 1;
      if (task.status === "Not Started") acc.notStarted += 1;
      return acc;
    },
    { completed: 0, inProgress: 0, notStarted: 0 }
  );

  return (
    <PageContainer className="space-y-6">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {t("badge")}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("title")}</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              {t("description")}
            </p>
          </div>
          <AddTaskDialog triggerLabel={t("addTask")} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("allTasks")}</p>
              <ListChecks className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{snapshot.tasks.length}</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("active")}</p>
              <Clock3 className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{summary.notStarted + summary.inProgress}</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("completed")}</p>
              <CheckCircle2 className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{summary.completed}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5 space-y-1">
          <h2 className="text-lg font-semibold">{t("workspaceTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("workspaceDescription")}
          </p>
        </div>
        <TasksList tasks={snapshot.tasks} />
      </section>
    </PageContainer>
  );
}
