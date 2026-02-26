"use client";

import TopBar from "@/components/top-bar";
import AppSidebar from "@/components/app-sidebar";
import { TasksProvider } from "@/components/providers/tasks-provider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TasksProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* === Top Bar === */}
        <header className="sticky top-0 z-50 border-b bg-background">
          <TopBar />
        </header>

        {/* === Layout Wrapper === */}
        <div className="flex flex-1">
          {/* === Sidebar (desktop only) === */}
          <AppSidebar />

          {/* === Content === */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </TasksProvider>
  );
}
