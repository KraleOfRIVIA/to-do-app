"use client";

import { useTranslations } from "next-intl";
import { useTasksContext } from "@/components/providers/tasks-provider";
import TasksList from "@/components/task/tasks-list";

export function DashboardContent() {
  const { upcoming } = useTasksContext();
  const t = useTranslations("DashboardContent");

  return (
    <TasksList
      tasks={upcoming}
      listTitle={t("listTitle")}
      listDescription={t("listDescription")}
      emptyTitle={t("emptyTitle")}
      emptyDescription={t("emptyDescription")}
    />
  );
}

