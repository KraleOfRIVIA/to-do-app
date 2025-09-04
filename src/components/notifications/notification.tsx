"use client"

import { useEffect } from "react"
import { toast } from "sonner"

// тестовые задачи (одна с дедлайном через 30 секунд)
const tasks = [
  { id: 1, title: "Finish UI design", deadline: new Date(Date.now() + 30 * 1000) }, // дедлайн через 30 сек
  { id: 2, title: "Prepare report", deadline: new Date(Date.now() + 60 * 1000) }, // дедлайн через 1 мин
]

export function TaskDeadlineWatcher() {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      tasks.forEach((task) => {
        const diff = task.deadline.getTime() - now.getTime()

        // если меньше минуты до дедлайна
        if (diff > 0 && diff < 60 * 1000) {
          toast("⏰ Task reminder", {
            description: `${task.title} is due at ${task.deadline.toLocaleTimeString()}`,
            action: {
              label: "Open",
              onClick: () => console.log("Go to task", task.id),
            },
          })
        }
      })
    }, 60 * 1000) // проверяем каждые 60 секунд

    return () => clearInterval(interval)
  }, [])

  return null
}
