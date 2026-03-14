import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Task from "@/types/ITask";

interface CompletedTasksProps {
  tasks: Task[];
}

function formatRelativeDate(
  value: string | null,
  t: (key: string, values?: Record<string, string | number | Date>) => string
) {
  if (!value) {
    return t("noDueDate");
  }

  const now = new Date();
  const target = new Date(value);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return t("today");
  if (diffDays === 1) return t("oneDayAgo");
  return t("daysAgo", { days: diffDays });
}

export function CompletedTasks({ tasks }: CompletedTasksProps) {
  const t = useTranslations("CompletedTasks");

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <h3 className="text-base font-semibold">{t("title")}</h3>
        </div>
        <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <ul className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border bg-background/50 p-3">
              <div className="flex items-start gap-3">
                {task.image ? (
                  <Image
                    src={task.image}
                    alt={task.title}
                    width={52}
                    height={52}
                    className="h-12 w-12 rounded-md border object-cover"
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold">{task.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {task.description || t("noDescription")}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t("completedAt", { when: formatRelativeDate(task.date, t) })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
