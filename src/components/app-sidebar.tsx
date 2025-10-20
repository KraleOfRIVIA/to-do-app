"use client";

import {
  FaThLarge,
  FaExclamationCircle,
  FaCheckSquare,
  FaListUl,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import Image from "next/image";
import { useSession } from "next-auth/react";

const menuItems = [
  { icon: <FaThLarge />, label: "Dashboard", active: true },
  { icon: <FaExclamationCircle />, label: "Vital Task" },
  { icon: <FaCheckSquare />, label: "My Task" },
  { icon: <FaListUl />, label: "Task Categories" },
  { icon: <FaCog />, label: "Settings" },
  { icon: <FaQuestionCircle />, label: "Help" },
];

export default function AppSidebar() {
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground p-3">
      {/* User Info */}
      <div className="flex flex-col items-center relative -translate-y-10">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="User avatar"
            width={80}
            height={80}
            className="rounded-full border border-border shadow-md"
          />
        )}
        <div className="mt-1 text-center">
          <p className="font-semibold">{session.user?.name}</p>
          <p className="text-xs opacity-70">{session.user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-[-16]">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              item.active
                ? "bg-white text-sidebar font-bold"
                : "hover:bg-white/10"
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
