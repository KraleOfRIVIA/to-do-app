import { ChartNoAxesCombined } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TaskStatusStatsProps {
  completed: number;
  inProgress: number;
  notStarted: number;
}

const rows = [
  {
    key: "completed",
    labelKey: "completed",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "inProgress",
    labelKey: "inProgress",
    barClass: "bg-blue-500",
    textClass: "text-blue-700 dark:text-blue-300",
  },
  {
    key: "notStarted",
    labelKey: "notStarted",
    barClass: "bg-rose-500",
    textClass: "text-rose-700 dark:text-rose-300",
  },
] as const;

export function TaskStatusStats({ completed, inProgress, notStarted }: TaskStatusStatsProps) {
  const t = useTranslations("TaskStatus");
  const values = { completed, inProgress, notStarted };

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <header className="mb-5 flex items-center gap-2">
        <ChartNoAxesCombined className="size-4 text-muted-foreground" />
        <div>
          <h3 className="text-base font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </header>

      <div className="space-y-4">
        {rows.map((row) => {
          const value = values[row.key];
          return (
            <div key={row.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className={cn("font-medium", row.textClass)}>{t(`rows.${row.labelKey}`)}</span>
                <span className="font-semibold">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                <div
                  className={cn("h-full rounded-full transition-all", row.barClass)}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
