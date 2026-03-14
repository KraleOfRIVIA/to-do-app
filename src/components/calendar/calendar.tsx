"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toIntlLocale } from "@/lib/i18n/locale";

export function Calendar02() {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const today = React.useMemo(() => new Date(), []);

  const formattedDate = new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: "short",
    day: "2-digit",
    month: "long",
  }).format(today);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("openCalendar")}
            className="h-9 w-9 rounded-xl bg-background/80"
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background" align="end">
          <Calendar mode="single" selected={today} defaultMonth={today} />
        </PopoverContent>
      </Popover>

      <span className="hidden text-sm font-medium capitalize text-foreground xl:inline">{formattedDate}</span>
    </div>
  );
}
