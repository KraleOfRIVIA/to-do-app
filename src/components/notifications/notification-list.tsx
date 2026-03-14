"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTasksContext } from "@/components/providers/tasks-provider";
import { getPriorityKey, getStatusKey } from "@/lib/tasks/task-i18n";

export function NotificationList() {
  const { upcoming } = useTasksContext();
  const t = useTranslations("Notifications");
  const tTask = useTranslations("TaskCommon");
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(
    () => upcoming.filter((task) => task.status !== "Completed").length,
    [upcoming]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={t("openNotifications")}
          className="relative h-9 w-9 rounded-xl bg-background/80"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {activeCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
            >
              {activeCount > 9 ? "9+" : activeCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 rounded-xl bg-background p-4 shadow-lg">
        <h3 className="mb-2 text-base font-semibold">{t("title")}</h3>
        <div className="max-h-60 space-y-3 overflow-y-auto">
          {upcoming.length > 0 ? (
            upcoming.map((task) => (
              <article key={task.id} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="line-clamp-1 font-medium text-foreground">{task.title}</p>
                  <span className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {tTask(`status.${getStatusKey(task.status)}`)}
                  </span>
                </div>

                {task.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                ) : null}

                <div className="mt-2 text-xs text-muted-foreground">
                  {t("priorityLabel", { priority: tTask(`priority.${getPriorityKey(task.priority)}`) })}
                </div>
              </article>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">{t("empty")}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
