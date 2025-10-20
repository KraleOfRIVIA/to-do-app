import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Группировка по статусу
  const tasks = await prisma.task.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  const total = tasks.reduce((acc, t) => acc + t._count.status, 0);

  const stats = {
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  };

  for (const t of tasks) {
    const percent = Math.round((t._count.status / total) * 100);
    if (t.status === "Completed") stats.completed = percent;
    if (t.status === "In Progress") stats.inProgress = percent;
    if (t.status === "Not Started") stats.notStarted = percent;
  }

  return NextResponse.json(stats);
}
