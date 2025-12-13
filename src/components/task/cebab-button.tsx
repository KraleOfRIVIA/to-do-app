import { Ellipsis } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EditTaskDialog } from './edit-task';
import Task from '@/types/ITask';
import { useDeleteTask } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CebabButtonProps {
    task: Task 
}

export function CebabButton({task}: CebabButtonProps) {
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error("Failed to delete task:", error);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent className="bg-background">
        <div className="flex flex-col gap-2">
            <EditTaskDialog task={task}/>
            <Button 
              variant="ghost" 
              onClick={handleDelete}
              disabled={deleteTaskMutation.isPending}
              className="w-full justify-start"
            >
              {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
