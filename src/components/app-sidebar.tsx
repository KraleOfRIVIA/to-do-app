"use client"
import React from "react";
import { FaThLarge, FaExclamationCircle, FaCheckSquare, FaListUl, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import Image from 'next/image';
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
  
  return (
    <div className="bg-sidebar flex flex-col items-center shadow-[2px_0_8px_rgba(0,0,0,0.05)] md:h-screen mr-10 pr-5">
      {/* Верхняя часть с аватаром */}
      <div className="flex flex-col items-center mb-8 relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-20 h-20">
          {session?.user?.image && (
            <Image
              src={session?.user.image}
              alt="User avatar"
              className="rounded-full border-4 border-border shadow-lg object-cover w-full h-full"
              width={100}
              height={100}
          />
          )}
        </div>
        <div className="mt-12 text-sidebar-foreground font-semibold text-base text-center">{session?.user?.name}</div>
        <div className="text-sidebar-foreground text-xs opacity-80 text-center">{session?.user?.email}</div>
      </div>
      {/* Меню */}
      <nav className="w-full flex-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-6 py-3 ${
              item.active ? "bg-white text-sidebar font-bold shadow" : "text-sidebar-foreground"
            } rounded-xl mb-2 font-medium cursor-pointer text-[15px] transition-colors hover:bg-white/20`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}