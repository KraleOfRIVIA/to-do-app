import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

type TaskStatus = "Not Started" | "In Progress" | "Completed";

interface TaskCardProps {
  title: string;
  description: string;
  priority: "Low" | "Moderate" | "High" | "Extreme";
  status: TaskStatus;
  createdAt: string;
  image?: string;
  selected?: boolean; // активная карточка
  onClick?: () => void; // обработчик клика
}

const statusColors: Record<TaskStatus, string> = {
  "Not Started": "text-red-500",
  "In Progress": "text-blue-500",
  "Completed": "text-green-500",
};

const priorityColors: Record<TaskCardProps["priority"], string> = {
  Low: "text-gray-500",
  Moderate: "text-blue-400",
  High: "text-orange-500",
  Extreme: "text-red-600 font-bold",
};

export function TaskCard({
  title,
  description,
  priority,
  status,
  createdAt,
  image,
  selected,
  onClick,
}: TaskCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl shadow-md transition border cursor-pointer",
        selected
          ? "bg-primary/10 border-primary"
          : "bg-card hover:shadow-lg border-border"
      )}
    >
      <CardContent className="flex flex-row items-start gap-4 p-0">
        {/* Индикатор статуса */}
        <div className="flex flex-col items-center pt-1">
          <span
            className={cn(
              "inline-block w-3 h-3 rounded-full border-2 border-current",
              statusColors[status]
            )}
            title={status}
          />
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {description}
          </p>
          <div className="flex gap-3 flex-wrap text-xs items-center">
            <span className={cn(priorityColors[priority], "font-medium")}>
              Priority: {priority}
            </span>
            <span className={cn(statusColors[status], "font-medium")}>
              Status: {status}
            </span>
            <span className="text-gray-400">Created: {createdAt}</span>
          </div>
        </div>

        {/* Картинка */}
        {image && (
          <div className="flex-shrink-0 ml-2">
            <Image
              src={image}
              alt={title}
              className="rounded-lg object-cover"
              width={64}
              height={64}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
