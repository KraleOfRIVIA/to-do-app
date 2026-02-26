"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTasksContext } from "@/components/providers/tasks-provider";

export function NotificationList() {
  const { upcoming } = useTasksContext();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="bg-primary border-border rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer text-background hover:text-primary"
          variant="outline"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 bg-background shadow-lg rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {upcoming.length > 0 ? (
            upcoming.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded-md border border-border transition ${
                  n.status === "Not Started"
                    ? "hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    : "hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-foreground">{n.title}</p>
                  {n.status === "Not Started" ? (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                      ⚠️ Not Started
                    </span>
                  ) : (
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      ✅ Completed
                    </span>
                  )}
                </div>

                {n.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {n.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs mt-1 text-muted-foreground">
                  <span className="font-medium text-destructive">{n.priority}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notifications
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

