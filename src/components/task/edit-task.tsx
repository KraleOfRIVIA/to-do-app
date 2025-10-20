"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {useTaskStore } from "@/lib/store/task/task-store";
import Task from "@/types/ITask";

type EditTaskDialogProps = {
  task: Task;
};

export function EditTaskDialog({task}: EditTaskDialogProps) {
    const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.date);
  const [priority, setPriority] = useState<"Low" | "Moderate" | "High">(task.priority);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<"Not Started" | "In Progress" | "Completed">(task.status);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(task.date);
      setPriority(task.priority);
      setDescription(task.description);
    }
  }, [task]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    await updateTask(task.id, {
      title,
      date,
      priority,
      description,
      status,
    });

    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Label className="mb-4">Edit Task</Label>
        </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Edit Task</DialogTitle>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-sm font-medium"
          >
            Go Back
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div>
            <Label>Priority</Label>
            <RadioGroup
              name="priority"
              value={priority}
              onValueChange={(val) => setPriority(val as "Low" | "Moderate" | "High")}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center gap-1">
                <span className="text-green-500 text-xs">●</span>
                <RadioGroupItem value="Low" id="low" />
                <Label htmlFor="low" className="ml-1">Low</Label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-500 text-xs">●</span>
                <RadioGroupItem value="Moderate" id="moderate" />
                <Label htmlFor="moderate" className="ml-1">Moderate</Label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-500 text-xs">●</span>
                <RadioGroupItem value="High" id="high" />
                <Label htmlFor="high" className="ml-1">High</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Start writing here..."
            />
          </div>
          {/** Status */}
          <div>
            <Label>Status</Label>
            <RadioGroup

              name="status"
              value={status}
              className="flex gap-6 mt-2"
              onValueChange={(val) => setStatus(val as "Not Started" | "In Progress" | "Completed")}
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="Not Started" id="not-started" />
                <Label htmlFor="not-started" className="ml-1">Not Started</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="In Progress" id="in-progress" />
                <Label htmlFor="in-progress" className="ml-1">In Progress</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="Completed" id="completed" />
                <Label htmlFor="completed" className="ml-1">Completed</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Done"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
