import TopBar from "@/components/top-bar"
import AppSidebar from "@/components/app-sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopBar сверху */}
      <div className="sticky top-0 z-50 w-full">
        <TopBar />
      </div>

      <div className="flex flex-1 rounded-radius-lg">
        {/* Sidebar фиксированный слева */}
        <div className="lg:flex fixed mt-15 ">
          <AppSidebar />
        </div>

        {/* Контент с отступом слева (чтобы не наезжать на сайдбар) */}
        <main className="flex-1 ml-[280px] p-10 m-5">
          {children}
        </main>
      </div>
    </div>
  )
}
