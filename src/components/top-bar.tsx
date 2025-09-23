"use client"
import React from "react";
import { Calendar02 } from "./calendar/calendar";
import { Search } from 'lucide-react';
import { ModeToggle } from "./theme/theme-toggle";
import { useSession } from "next-auth/react";
import { NotificationList } from "./notifications/notification-list";

export const TopBar: React.FC = () => {
    const { status } = useSession();

  if (status !== "authenticated") {
    return null;
  }
    return (
        <div className="flex items-center px-10 py-5 bg-card shadow-[0_2px_16px_rgba(0,0,0,0.2)] justify-between">
            {/* Logo */}
            <div className="text-[28px] font-bold">
            <span className="text-primary">TO</span>
            <span className="text-foreground">DO</span>
            </div>

            {/* Search */}
            <div className="flex flex-1 justify-center">
                <div className="flex items-center bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.07)] px-2 w-[400px] h-10">
                    <input
                        type="text"
                        placeholder="Search your task here..."
                        className="border-none outline-none bg-white flex-1 text-sm px-3 text-background rounded-l-xl"
                    />
                    <button
                        className="bg-primary border-none rounded-r-xl w-10 h-10 flex items-center justify-center cursor-pointer m-[-10px]"
                    >
                        <Search className="text-foreground " />
                    </button>
                </div>
            </div>

            {/* Icons & Date */}
            <div className="flex items-center gap-4">
                <NotificationList />
            </div>
            <div className="flex items-center gap-4 ml-4">
            <Calendar02 />
            </div>
            <div className="flex items-center gap-4 ml-4">
                <ModeToggle />
            </div>
        </div>
    );
};

export default TopBar