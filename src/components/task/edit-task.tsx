"use client";

import { type ReactNode, useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateTaskAction } from "@/app/(app)/actions/task-actions";
import type Task from "@/types/ITask";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type EditTaskDialogProps = {
  task: Task;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: ReactNode;
};

type FormData = {
  title: string;
  date: string;
  priority: "Low" | "Moderate" | "High";
  description?: string;
  status: "Not Started" | "In Progress" | "Completed";
};

export function EditTaskDialog({
  task,
  triggerLabel,
  triggerClassName,
  triggerIcon,
}: EditTaskDialogProps) {
  const t = useTranslations("EditTaskDialog");
  const tTask = useTranslations("TaskCommon");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const idPrefix = `task-${task.id}`;

  const [formData, setFormData] = useState<FormData>({
    title: task.title,
    date: task.date ? task.date.slice(0, 10) : "",
    priority: task.priority,
    description: task.description,
    status: task.status,
  });

  useEffect(() => {
    setFormData({
      title: task.title,
      date: task.date ? task.date.slice(0, 10) : "",
      priority: task.priority,
      description: task.description,
      status: task.status,
    });
  }, [task]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateTaskAction({
        id: task.id,
        title: formData.title,
        date: formData.date || null,
        priority: formData.priority,
        description: formData.description,
        status: formData.status,
      });

      if (!result.ok) {
        toast.error(result.message ?? t("updateFailed"));
        return;
      }

      setOpen(false);
      toast.success(t("updateSuccess"));
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" className={cn("justify-start", triggerClassName)}>
          {triggerIcon}
          {triggerLabel ?? t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>{t("title")}</DialogTitle>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-sm font-medium"
          >
            {t("goBack")}
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <Label htmlFor="title">{t("fields.title")}</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">{t("fields.date")}</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date || ""}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>

          <div>
            <Label>{t("fields.priority")}</Label>
            <RadioGroup
              name="priority"
              value={formData.priority}
              onValueChange={(value) =>
                updateField("priority", value as "Low" | "Moderate" | "High")
              }
              className="mt-2 flex gap-6"
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="Low" id={`${idPrefix}-low`} />
                <Label htmlFor={`${idPrefix}-low`} className="ml-1">
                  {tTask("priority.low")}
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="Moderate" id={`${idPrefix}-moderate`} />
                <Label htmlFor={`${idPrefix}-moderate`} className="ml-1">
                  {tTask("priority.moderate")}
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="High" id={`${idPrefix}-high`} />
                <Label htmlFor={`${idPrefix}-high`} className="ml-1">
                  {tTask("priority.high")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description">{t("fields.description")}</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder={t("fields.descriptionPlaceholder")}
            />
          </div>

          <div>
            <Label>{t("fields.status")}</Label>
            <RadioGroup
              name="status"
              value={formData.status}
              className="mt-2 flex gap-6"
              onValueChange={(value) =>
                updateField("status", value as "Not Started" | "In Progress" | "Completed")
              }
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="Not Started" id={`${idPrefix}-not-started`} />
                <Label htmlFor={`${idPrefix}-not-started`} className="ml-1">
                  {tTask("status.notStarted")}
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="In Progress" id={`${idPrefix}-in-progress`} />
                <Label htmlFor={`${idPrefix}-in-progress`} className="ml-1">
                  {tTask("status.inProgress")}
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="Completed" id={`${idPrefix}-completed`} />
                <Label htmlFor={`${idPrefix}-completed`} className="ml-1">
                  {tTask("status.completed")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("saving") : t("done")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
