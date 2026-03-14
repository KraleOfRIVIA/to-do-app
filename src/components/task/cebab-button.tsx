"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EditTaskDialog } from "./edit-task";
import type Task from "@/types/ITask";
import { deleteTaskAction } from "@/app/(app)/actions/task-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CebabButtonProps {
  task: Task;
}

export function CebabButton({ task }: CebabButtonProps) {
  const t = useTranslations("TaskActions");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(t("confirmDelete"))) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTaskAction(task.id);

      if (!result.ok) {
        toast.error(result.message ?? t("deleteFailed"));
        return;
      }

      toast.success(t("deleteSuccess"));
      router.refresh();
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("openActionsFor", { title: task.title })}
          className="size-8 text-muted-foreground"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-48 bg-background p-2">
        <div className="flex flex-col gap-1">
          <EditTaskDialog
            task={task}
            triggerLabel={t("editTask")}
            triggerClassName="h-8 w-full justify-start px-2 text-sm font-normal"
            triggerIcon={<PencilLine className="size-3.5" />}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 w-full justify-start px-2 text-sm font-normal text-red-600 hover:text-red-600"
          >
            <Trash2 className="size-3.5" />
            {isPending ? t("deleting") : t("deleteTask")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
