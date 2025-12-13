"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddTask } from "@/hooks/useTasks";
import { useSession } from "next-auth/react";
import { uploadImage } from "@/lib/supabase/upload-images";
import { toast } from "sonner";

export function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);  
  const { status } = useSession();
  const addTaskMutation = useAddTask();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (status !== "authenticated") {
    alert("You must be logged in to add tasks");
    return;
  }

  const formData = new FormData(e.currentTarget);

  let imageUrl: string | undefined = undefined;
  if (file) {
    imageUrl = await uploadImage(file);
  }

  const dateValue = formData.get("date") as string;
  const task = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    date: dateValue || undefined,
    priority: formData.get("priority") as "Low" | "Moderate" | "High",
    status: "Not Started" as const,
    image: imageUrl,
  };

  try {
    await addTaskMutation.mutateAsync({
      ...task,
      date: task.date ?? null,
    });
    setOpen(false);
    setFile(null);
    e.currentTarget.reset();
    toast.success("Task added successfully");
  } catch (error) {
    toast.error("Failed to add task");
    console.error("Failed to add task:", error);
  }
}


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">+ Add Task</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" name="date" />
          </div>
          
          <div>
            <Label>Priority</Label>
            <RadioGroup name="priority" defaultValue="Moderate" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="description">Task Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={addTaskMutation.isPending}>
            {addTaskMutation.isPending ? "Saving..." : "Done"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
