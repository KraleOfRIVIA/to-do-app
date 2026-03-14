import TopBar from "@/components/top-bar";
import AppSidebar from "@/components/app-sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <TopBar />
      </header>
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-6 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
