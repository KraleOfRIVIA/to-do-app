import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from 'next/image';

type TaskStatus = "Not Started" | "In Progress" | "Completed";

interface TaskCardProps {
  title: string;
  description: string;
  priority: "Low" | "Moderate" | "High";
  status: TaskStatus;
  createdAt: string;
  image?: string;
}

const statusColors: Record<TaskStatus, string> = {
  "Not Started": "text-red-500",
  "In Progress": "text-blue-500",
  "Completed": "text-green-500",
};

export function TaskCard({
  title,
  description,
  priority,
  status,
  createdAt,
  image,
}: TaskCardProps) {
  return (
    <Card className="p-4 rounded-xl shadow-md hover:shadow-lg transition">
      <CardContent className="flex gap-4 items-start">
        {image && (
          <Image
            src="/auth.png"
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
            width={64}
            height={64}
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="mt-2 text-xs flex gap-4">
            <span className="text-gray-500">Priority: {priority}</span>
            <span className={cn(statusColors[status])}>Status: {status}</span>
            <span className="text-gray-400">Created: {createdAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
