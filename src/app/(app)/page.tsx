import type { Metadata } from "next";
import { CalendarClock, ChartNoAxesCombined, ListTodo } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { AddTaskDialog } from "@/components/task/add-task";
import { DashboardContent } from "@/components/task/dashboard-content";
import { TaskStatusStats } from "@/components/task/task-status";
import { CompletedTasks } from "@/components/task/completed-task";
import { getTaskSnapshot } from "@/lib/tasks/task-queries";

export const metadata: Metadata = {
  title: "Dashboard | Task Manager",
  description: "View your upcoming tasks, statistics, and completed tasks",
};

export default async function DashboardPage() {
  const t = await getTranslations("DashboardPage");
  const snapshot = await getTaskSnapshot();

  return (
    <PageContainer className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {t("badge")}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              {t("description")}
            </p>
          </div>
          <AddTaskDialog triggerLabel={t("createTask")} />
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("upcoming5Days")}</p>
              <CalendarClock className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{snapshot.upcoming.length}</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("completed")}</p>
              <ChartNoAxesCombined className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{snapshot.completed.length}</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("allTasks")}</p>
              <ListTodo className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{snapshot.tasks.length}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{t("upcomingTasks")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("upcomingTasksDescription")}
                </p>
              </div>
              <ListTodo className="size-5 shrink-0 text-muted-foreground" />
            </div>
            <div className="mt-5">
              <DashboardContent />
            </div>
          </section>
        </div>
        <div className="flex flex-col gap-6">
          <TaskStatusStats
            completed={snapshot.stats.completed}
            inProgress={snapshot.stats.inProgress}
            notStarted={snapshot.stats.notStarted}
          />
          <CompletedTasks tasks={snapshot.completed} />
        </div>
      </div>
    </PageContainer>
  );
}
