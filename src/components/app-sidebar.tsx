"use client";

import {
  FaThLarge,
  FaCheckSquare,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: <FaThLarge />, label: "Dashboard", href: "/" },
  { icon: <FaCheckSquare />, label: "My Task", href: "/tasks" },
  { icon: <FaCog />, label: "Settings", href: "/settings" },
  { icon: <FaQuestionCircle />, label: "Help", href: "/help" },
];

export default function AppSidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); 

  if (!session) return null;

  return (
    <>
      {/* === Desktop Sidebar === */}
      <div className="hidden md:flex flex-col min-h-screen p-4 w-64 bg-sidebar text-sidebar-foreground mt-10">
        <div className="flex flex-col items-center mb-6">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User avatar"}
              width={80}
              height={80}
              className="rounded-full border border-border shadow-md"
            />
          )}
          <div className="mt-2 text-center">
            <p className="font-semibold">{session.user?.name}</p>
            <p className="text-xs opacity-70">{session.user?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={isActive ? "#" : item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${isActive ? "bg-white/20 text-white cursor-default" : "hover:bg-white/10"}
                `}
                aria-disabled={isActive}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* === Mobile Menu === */}
      <div className="md:hidden">
        <div className="fixed top-20 w-full bg-sidebar shadow-sm z-40 flex items-center justify-center">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setOpen(!open)}
          >
              {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="fixed top-28 left-0 w-full bg-sidebar text-sidebar-foreground z-40 shadow-lg animate-slide-down">
            <nav className="flex flex-col gap-1 p-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={isActive ? "#" : item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                      ${isActive ? "bg-white/20 text-white cursor-default" : "hover:bg-white/10"}
                    `}
                    aria-disabled={isActive}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
