// TaskView.tsx (оставим как есть, он уже норм)
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Task from "@/types/ITask";
import { Label } from "@radix-ui/react-dropdown-menu";

type TaskViewProps = {
  task: Task;
};

export function TaskView({ task }: TaskViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Label className="font-semibold text-base mb-1">{task.title}</Label>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <p>{task.description}</p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          {task.date && (
            <p>
              <strong>Date:</strong> {new Date(task.date).toLocaleDateString("ru-RU")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
