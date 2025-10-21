
import { ModeToggle } from "./theme/theme-toggle";
import { Calendar02 } from "./calendar/calendar";
import { NotificationList } from "./notifications/notification-list";
import SearchTask from "./task/search-task";

export default function TopBar() {

  return (
    <div className="w-full bg-card shadow flex items-center justify-between px-6 py-3">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <span className="text-primary">TO</span>
        <span className="text-foreground">DO</span>
      </div>

      {/* Search */}
      <SearchTask />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <NotificationList />
        <Calendar02 />
        <ModeToggle />
      </div>
    </div>
  );
}
