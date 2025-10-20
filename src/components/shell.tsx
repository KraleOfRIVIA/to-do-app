import TopBar from "@/components/top-bar";
import AppSidebar from "@/components/app-sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        grid
        grid-rows-[auto_1fr]
        grid-cols-[240px_1fr]
        min-h-screen
        bg-background
      "
    >
      {/* === Top Bar === */}
      <header className="row-start-1 row-end-2 col-span-2 sticky top-0 z-50">
        <TopBar />
      </header>

      {/* === Sidebar === */}
      <aside className="row-start-2 col-start-1 col-end-2 border-r bg-sidebar mt-10">
        <AppSidebar />
      </aside>

      {/* === Content === */}
      <main className="row-start-2 col-start-2 col-end-3 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
