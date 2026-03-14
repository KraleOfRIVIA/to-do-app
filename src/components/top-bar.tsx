import Link from "next/link";
import { useTranslations } from "next-intl";
import { ModeToggle } from "./theme/theme-toggle";
import { Calendar02 } from "./calendar/calendar";
import { NotificationList } from "./notifications/notification-list";
import { LocaleSwitcher } from "./locale-switcher";
import SearchTask from "./task/search-task";

export default function TopBar() {
  const t = useTranslations("TopBar");

  return (
    <div className="w-full border-b bg-card/95 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
        <Link
          href="/"
          aria-label={t("goToDashboard")}
          className="inline-flex items-center rounded-lg text-2xl font-bold transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="text-primary">TO</span>
          <span className="text-foreground">DO</span>
        </Link>

        <div className="order-3 w-full lg:order-none lg:max-w-xl lg:flex-1">
          <SearchTask />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationList />
          <Calendar02 />
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
