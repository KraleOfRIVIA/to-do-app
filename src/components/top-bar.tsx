"use client";

import { Search } from "lucide-react";
import { ModeToggle } from "./theme/theme-toggle";
import { Calendar02 } from "./calendar/calendar";
import { NotificationList } from "./notifications/notification-list";
import { useSession } from "next-auth/react";

export default function TopBar() {
  const { status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <div className="w-full bg-card shadow flex items-center justify-between px-6 py-3">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <span className="text-primary">TO</span>
        <span className="text-foreground">DO</span>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-xl shadow px-3 w-full max-w-[400px] h-10">
        <input
          type="text"
          placeholder="Search tasks..."
          className="flex-1 bg-transparent border-none outline-none text-sm px-2"
        />
        <Search className="text-foreground" size={18} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <NotificationList />
        <Calendar02 />
        <ModeToggle />
      </div>
    </div>
  );
}
