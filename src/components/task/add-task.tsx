"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { uploadImage } from "@/lib/uploads/upload-image";
import { addTaskAction } from "@/app/(app)/actions/task-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AddTaskDialogProps = {
  triggerLabel?: string;
  triggerClassName?: string;
};

export function AddTaskDialog({
  triggerLabel,
  triggerClassName,
}: AddTaskDialogProps) {
  const t = useTranslations("AddTaskDialog");
  const tTask = useTranslations("TaskCommon");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const dateValue = formData.get("date") as string;

    let imageUrl: string | undefined;
    if (file) {
      try {
        imageUrl = await uploadImage(file);
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error(t("uploadFailed"));
        return;
      }
    }

    const payload = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      date: dateValue || null,
      priority: formData.get("priority") as "Low" | "Moderate" | "High",
      status: "Not Started" as const,
      image: imageUrl,
    };

    startTransition(async () => {
      const result = await addTaskAction(payload);

      if (!result.ok) {
        toast.error(result.message ?? t("addFailed"));
        return;
      }

      setOpen(false);
      setFile(null);
      form.reset();
      toast.success(t("addSuccess"));
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn(triggerClassName)}>{triggerLabel ?? t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t("fields.title")}</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="date">{t("fields.date")}</Label>
            <Input type="date" id="date" name="date" />
          </div>

          <div>
            <Label>{t("fields.priority")}</Label>
            <RadioGroup name="priority" defaultValue="Moderate" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="low" />
                <Label htmlFor="low">{tTask("priority.low")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Moderate" id="moderate" />
                <Label htmlFor="moderate">{tTask("priority.moderate")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="high" />
                <Label htmlFor="high">{tTask("priority.high")}</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="description">{t("fields.description")}</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          <div>
            <Label htmlFor="image">{t("fields.image")}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("saving") : t("done")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
