"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar02() {
  const [open, setOpen] = React.useState(false)

  // ✅ текущая дата
  const today = new Date()

  // ✅ мок даты (события)
  const highlightedDates = [
    new Date(2025, 8, 5),
    new Date(2025, 8, 10),
    new Date(2025, 8, 15),
  ]

  // ✅ формат даты: День недели + dd.MM.yyyy
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(today)

  return (
    <div className="flex items-center gap-3">
      {/* Текущая дата */}

      {/* Кнопка-календарь */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-10 justify-center font-normal bg-primary hover:bg-background text-background hover:text-primary p-0"
          >
            <CalendarDays />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background" align="start">
          <Calendar
            mode="single"
            selected={today} // выделяем сегодняшнюю дату
            modifiers={{
              highlight: highlightedDates, // подсвечиваем кастомные даты
            }}
            modifiersClassNames={{
              highlight:
                "bg-primary text-primary-foreground rounded-full", // стиль событий
            }}
          />
        </PopoverContent>
      </Popover>
      <span className="text-sm font-medium text-foreground capitalize">
        {formattedDate}
      </span>
    </div>
  )
}
