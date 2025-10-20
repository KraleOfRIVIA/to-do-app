import { Ellipsis } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EditTaskDialog } from './edit-task';
import Task from '@/types/ITask';
import { Label } from '@radix-ui/react-dropdown-menu';


interface CebabButtonProps {
    task: Task 
}

export function CebabButton({task}: CebabButtonProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent className="bg-background">
        <div className="h-flex ">
            <EditTaskDialog task={task}/>
            <Label className="">Delete</Label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
