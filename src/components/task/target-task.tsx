import Image from "next/image";
import { CalendarDays, CircleCheckBig, Flag, PencilLine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Task from "@/types/ITask";
import { EditTaskDialog } from "./edit-task";
import { cn } from "@/lib/utils";
import { toIntlLocale } from "@/lib/i18n/locale";
import { getPriorityKey, getStatusKey } from "@/lib/tasks/task-i18n";

type TaskFullCardProps = {
  task: Task | null;
};

const statusStyles = {
  "Not Started": "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  "In Progress": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
} as const;

const priorityStyles = {
  Low: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  Moderate: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  High: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
} as const;

function formatDate(value: string | null, locale: string, noDateLabel: string) {
  if (!value) {
    return noDateLabel;
  }

  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function TargetTask({ task }: TaskFullCardProps) {
  const t = useTranslations("TargetTask");
  const tTask = useTranslations("TaskCommon");
  const locale = useLocale();

  if (!task) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed bg-background/60 px-6 text-center">
        <CircleCheckBig className="mb-3 size-6 text-muted-foreground" />
        <p className="text-sm font-medium">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border bg-background/60">
      {task.image ? (
        <Image
          src={task.image}
          alt={task.title}
          width={640}
          height={220}
          className="h-40 w-full border-b object-cover"
        />
      ) : null}

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{task.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("created", { date: formatDate(task.createdAt, locale, t("noDate")) })}
            </p>
          </div>
          <EditTaskDialog
            task={task}
            triggerLabel={t("edit")}
            triggerClassName="h-8 px-3 text-xs"
            triggerIcon={<PencilLine className="size-3.5" />}
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className={cn("rounded-full px-2 py-1", priorityStyles[task.priority])}>
            <Flag className="mr-1 inline size-3.5" />
            {t("priorityWithValue", { value: tTask(`priority.${getPriorityKey(task.priority)}`) })}
          </span>
          <span className={cn("rounded-full px-2 py-1", statusStyles[task.status])}>
            {tTask(`status.${getStatusKey(task.status)}`)}
          </span>
        </div>

        <div className="rounded-lg border bg-card px-3 py-2 text-sm">
          <p className="text-muted-foreground">{t("dueDate")}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
            <CalendarDays className="size-4 text-muted-foreground" />
            {formatDate(task.date, locale, t("noDate"))}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">{t("description")}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {task.description || t("noDescription")}
          </p>
        </div>
      </div>
    </article>
  );
}
