"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useTasksContext } from "@/components/providers/tasks-provider"

export function TaskDeadlineWatcher() {
  const { tasks } = useTasksContext()
  const notifiedTasksRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Сбрасываем уведомления при изменении списка задач
    notifiedTasksRef.current.clear()
  }, [tasks.length])

  useEffect(() => {
    if (tasks.length === 0) return

    const interval = setInterval(() => {
      const now = new Date()

      tasks.forEach((task) => {
        if (!task.date) return
        
        const taskDate = new Date(task.date as string)
        const diff = taskDate.getTime() - now.getTime()

        // Показываем уведомление только один раз для каждой задачи
        if (diff > 0 && diff < 60 * 1000 && !notifiedTasksRef.current.has(task.id)) {
          notifiedTasksRef.current.add(task.id)
          toast("⏰ Task reminder", {
            description: `${task.title} is due at ${taskDate.toLocaleTimeString()}`,
            action: {
              label: "Open",
              onClick: () => console.log("Go to task", task.id),
            },
          })
        }
      })
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [tasks])

  return null
}
