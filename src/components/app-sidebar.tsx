"use client";

import type { IconType } from "react-icons";
import { FaCheckSquare, FaCog, FaQuestionCircle, FaThLarge } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type MenuItem = {
  icon: IconType;
  labelKey: "dashboard" | "myTasks" | "settings" | "help";
  href: string;
};

const menuItems: MenuItem[] = [
  { icon: FaThLarge, labelKey: "dashboard", href: "/" },
  { icon: FaCheckSquare, labelKey: "myTasks", href: "/tasks" },
  { icon: FaCog, labelKey: "settings", href: "/settings" },
  { icon: FaQuestionCircle, labelKey: "help", href: "/help" },
];

type SidebarNavProps = {
  pathname: string;
  t: (key: string) => string;
  onNavigate?: () => void;
};

function SidebarNav({ pathname, t, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.labelKey}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground pointer-events-none"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={onNavigate}
          >
            <Icon className="size-4 shrink-0" />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppSidebar() {
  const { data: session } = useSession();
  const t = useTranslations("AppSidebar");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const displayName =
    session?.user?.nickname ||
    [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(" ").trim() ||
    session?.user?.name ||
    t("anonymousUser");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!session) {
    return null;
  }

  const userInitials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r p-4 bg-sidebar text-sidebar-foreground">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative size-20 overflow-hidden rounded-full border border-border bg-accent shadow-md">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || t("userAvatar")}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold">{userInitials}</span>
            )}
          </div>
          <div className="mt-2 text-center">
            <p className="font-semibold">{displayName}</p>
            <p className="text-xs opacity-70">{session.user?.email}</p>
          </div>
        </div>
        <SidebarNav pathname={pathname} t={t} />
      </aside>

      <div className="md:hidden">
        <button
          type="button"
          aria-label={open ? t("closeNavigationMenu") : t("openNavigationMenu")}
          className={cn(
            "fixed bottom-5 right-4 z-[60] rounded-xl border bg-sidebar p-2.5 text-sidebar-foreground shadow-lg transition-colors",
            open ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {open ? (
          <>
            <button
              type="button"
              aria-label={t("closeNavigationMenu")}
              className="fixed inset-0 z-40 bg-black/45"
              onClick={() => setOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 z-50 w-[min(86vw,320px)] border-l bg-sidebar p-4 text-sidebar-foreground shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("menu")}</p>
                <button
                  type="button"
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  aria-label={t("closeNavigationMenu")}
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-6 border-b pb-4">
                <p className="font-semibold">{displayName}</p>
                <p className="text-xs text-muted-foreground">{session.user?.email}</p>
              </div>

              <SidebarNav pathname={pathname} t={t} onNavigate={() => setOpen(false)} />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
