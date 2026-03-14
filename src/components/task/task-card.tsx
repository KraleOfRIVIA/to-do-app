import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Task from "@/types/ITask";
import { CebabButton } from "./cebab-button";
import { toIntlLocale } from "@/lib/i18n/locale";
import { getPriorityKey, getStatusKey } from "@/lib/tasks/task-i18n";

type TaskCardProps = {
  task: Task;
  isActive?: boolean;
  onSelect?: () => void;
};

const statusStyles = {
  "Not Started": {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  "In Progress": {
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
} as const;

const priorityStyles = {
  Low: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  Moderate: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  High: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
} as const;

function formatDate(value: string | null | undefined, locale: string, noDateLabel: string) {
  if (!value) {
    return noDateLabel;
  }

  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function TaskCard({ task, isActive = false, onSelect }: TaskCardProps) {
  const t = useTranslations("TaskCard");
  const tTask = useTranslations("TaskCommon");
  const locale = useLocale();
  const createdAtLabel = formatDate(task.createdAt, locale, t("noDate"));
  const dueDateLabel = formatDate(task.date, locale, t("noDate"));
  const statusStyle = statusStyles[task.status];

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border bg-card py-0 transition-all",
        isActive
          ? "border-primary/70 ring-1 ring-primary/30"
          : "hover:border-primary/35 hover:shadow-sm"
      )}
    >
      <CardContent className="flex items-start gap-3 px-4 py-4">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
          onClick={onSelect}
          aria-pressed={isActive}
        >
          <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", statusStyle.dot)} />

          <span className="min-w-0 flex-1 space-y-2">
            <span className="line-clamp-1 block text-sm font-semibold">{task.title}</span>

            <span className="line-clamp-2 block text-sm text-muted-foreground">
              {task.description || t("noDescription")}
            </span>

            <span className="flex flex-wrap items-center gap-2 text-xs">
              <span className={cn("rounded-full px-2 py-1 font-medium", priorityStyles[task.priority])}>
                {t("priorityLabel", {
                  priority: tTask(`priority.${getPriorityKey(task.priority)}`),
                })}
              </span>
              <span className={cn("rounded-full px-2 py-1 font-medium", statusStyle.badge)}>
                {tTask(`status.${getStatusKey(task.status)}`)}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {t("dueLabel", { date: dueDateLabel })}
              </span>
            </span>
            <span className="block text-xs text-muted-foreground">
              {t("createdLabel", { date: createdAtLabel })}
            </span>
          </span>
        </button>

        {task.image ? (
          <Image
            src={task.image}
            alt={task.title}
            width={64}
            height={64}
            className="hidden h-16 w-16 rounded-lg border object-cover sm:block"
          />
        ) : null}

        <div className="shrink-0">
          <CebabButton task={task} />
        </div>
      </CardContent>
    </Card>
  );
}
