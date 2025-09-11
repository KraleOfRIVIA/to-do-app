"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Notification = {
  id: string
  title: string
  description: string
  priority: "Low" | "Moderate" | "High" | "Extremely High"
  time: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Complete the UI design of Landing Page",
    description: "For FoodVentures",
    priority: "High",
    time: "2h",
  },
  {
    id: "2",
    title: "Complete the Mobile app design",
    description: "For Pet Warden",
    priority: "Extremely High",
    time: "2h",
  },
]

export function NotificationList() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="bg-primary border-border rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer text-background hover:text-primary"
          variant="outline"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-background shadow-lg rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {mockNotifications.length > 0 ? (
            mockNotifications.map((n) => (
              <div
                key={n.id}
                className="p-2 rounded-md border border-border hover:bg-muted/50 transition"
              >
                <p className="font-medium text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.description}</p>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-destructive">{n.priority}</span>
                  <span>{n.time} ago</span>
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
  )
}
