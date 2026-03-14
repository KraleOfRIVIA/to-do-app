"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useTasksContext } from "@/components/providers/tasks-provider";
import { toIntlLocale } from "@/lib/i18n/locale";

const ONE_MINUTE_MS = 60 * 1000;

export function TaskDeadlineWatcher() {
  const { tasks } = useTasksContext();
  const locale = useLocale();
  const t = useTranslations("Notifications");
  const notifiedTasksRef = useRef<Set<string>>(new Set());
  const tasksSignature = useMemo(
    () => tasks.map((task) => `${task.id}:${task.date ?? ""}:${task.status}`).join("|"),
    [tasks]
  );

  useEffect(() => {
    notifiedTasksRef.current.clear();
  }, [tasksSignature]);

  useEffect(() => {
    if (tasks.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (!task.date) {
          return;
        }

        const taskDate = new Date(task.date);
        const diffMs = taskDate.getTime() - now.getTime();
        const shouldNotify = diffMs > 0 && diffMs < ONE_MINUTE_MS;

        if (shouldNotify && !notifiedTasksRef.current.has(task.id)) {
          notifiedTasksRef.current.add(task.id);
          toast(t("reminderTitle"), {
            description: t("reminderDescription", {
              title: task.title,
              time: taskDate.toLocaleTimeString(toIntlLocale(locale)),
            }),
            action: {
              label: t("open"),
              onClick: () => console.log("Open task", task.id),
            },
          });
        }
      });
    }, ONE_MINUTE_MS);

    return () => clearInterval(interval);
  }, [locale, t, tasks]);

  return null;
}
