import AppShell from "@/components/shell";
import { AppProviders } from "@/components/providers/app-providers";
import { getTaskSnapshot } from "@/lib/tasks/task-queries";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const snapshot = await getTaskSnapshot();

  return (
    <AppProviders
      initialTasks={snapshot.tasks}
      initialUpcoming={snapshot.upcoming}
    >
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
