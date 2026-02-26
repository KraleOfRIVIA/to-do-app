import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Task from "@/types/ITask";
import { CebabButton } from "./cebab-button";
import { TaskView } from "./task-view";
type TaskCardProps = {
  task: Task;
  onClick?: () => void;
};

const statusColors = {
  "Not Started": "text-red-500",
  "In Progress": "text-blue-500",
  "Completed": "text-green-500",
} as const;

const priorityColors = {
  Low: "text-gray-500",
  Moderate: "text-blue-400",
  High: "text-orange-500",
  Extreme: "text-red-600 font-bold",
} as const;

export function TaskCard({ task,onClick}: TaskCardProps) {
  // ✅ Деструктурируем поля из задачи
  const { title, description, priority, status, createdAt, image } = task;

  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(new Date(createdAt))
    : "—";

  return (
    <Card
      className={cn(
        "p-3 rounded-xl shadow-md transition border cursor-pointer bg-card hover:shadow-lg border-border"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-0">
        {/* Индикатор статуса */}
        <div className="flex flex-row sm:flex-col items-center gap-2 pt-1">
          <span
            className={cn(
              "inline-block w-3 h-3 rounded-full border-2 border-current",
              statusColors[status as keyof typeof statusColors]
            )}
            title={status}
          />
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <TaskView task={task} />
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {description || "No description"}
          </p>

          <div className="flex flex-wrap gap-2 text-xs items-center">
            <span
              className={cn(
                priorityColors[priority as keyof typeof priorityColors],
                "font-medium"
              )}
            >
              Priority: {priority}
            </span>
            <span
              className={cn(
                statusColors[status as keyof typeof statusColors],
                "font-medium"
              )}
            >
              Status: {status}
            </span>
            <span className="text-gray-400">{formattedDate}</span>
          </div>
        </div>

        {/* Картинка */}
        {image && (
          <div className="flex-shrink-0 sm:ml-2 w-full sm:w-auto">
            <Image
              src={image}
              alt={title}
              className="rounded-lg object-cover w-full sm:w-[64px] h-[120px] sm:h-[64px]"
              width={64}
              height={64}
            />
          </div>
        )}
        <CebabButton task={task}/>
      </CardContent>
    </Card>
  );
}
