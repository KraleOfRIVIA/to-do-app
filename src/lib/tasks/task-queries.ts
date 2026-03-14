import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { auth } from "@/auth";
import { getUserTasksTag } from "@/lib/cache/cache-tags";
import prisma from "@/lib/prisma";
import type Task from "@/types/ITask";

export type TaskStats = {
  completed: number;
  inProgress: number;
  notStarted: number;
};

type TaskSnapshot = {
  tasks: Task[];
  upcoming: Task[];
  completed: Task[];
  stats: TaskStats;
};

const UPCOMING_DAYS_WINDOW = 5;
const TASK_SNAPSHOT_REVALIDATE_SECONDS = 60;

const emptyStats: TaskStats = {
  completed: 0,
  inProgress: 0,
  notStarted: 0,
};

function serializeTask(task: {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  createdAt: Date;
  date: Date | null;
  image: string | null;
}): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    priority: task.priority as Task["priority"],
    status: task.status as Task["status"],
    createdAt: task.createdAt.toISOString(),
    date: task.date ? task.date.toISOString() : null,
    image: task.image ?? undefined,
  };
}

function calcStats(
  grouped: Array<{ status: string; _count: { status: number } }>
): TaskStats {
  const total = grouped.reduce((acc, item) => acc + item._count.status, 0);
  if (total === 0) {
    return emptyStats;
  }

  const stats: TaskStats = {
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  };

  grouped.forEach((item) => {
    const percent = Math.round((item._count.status / total) * 100);
    if (item.status === "Completed") stats.completed = percent;
    if (item.status === "In Progress") stats.inProgress = percent;
    if (item.status === "Not Started") stats.notStarted = percent;
  });

  return stats;
}

async function fetchTaskSnapshotFromDatabase(userId: string): Promise<TaskSnapshot> {
  const now = new Date();
  const upcomingLimit = new Date(now);
  upcomingLimit.setDate(now.getDate() + UPCOMING_DAYS_WINDOW);

  const [tasks, upcoming, completed, grouped] = await Promise.all([
    prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: now,
          lte: upcomingLimit,
        },
        NOT: {
          status: "Completed",
        },
      },
      orderBy: {
        date: "asc",
      },
    }),
    prisma.task.findMany({
      where: {
        userId,
        status: "Completed",
        date: { lte: now },
      },
      orderBy: { date: "desc" },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
  ]);

  return {
    tasks: tasks.map(serializeTask),
    upcoming: upcoming.map(serializeTask),
    completed: completed.map(serializeTask),
    stats: calcStats(grouped),
  };
}

async function getCachedTaskSnapshot(userId: string): Promise<TaskSnapshot> {
  const loadSnapshot = unstable_cache(
    async () => fetchTaskSnapshotFromDatabase(userId),
    [`task-snapshot:${userId}`],
    {
      tags: [getUserTasksTag(userId)],
      revalidate: TASK_SNAPSHOT_REVALIDATE_SECONDS,
    }
  );

  return loadSnapshot();
}

export const getTaskSnapshot = cache(async (): Promise<TaskSnapshot> => {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    return {
      tasks: [],
      upcoming: [],
      completed: [],
      stats: emptyStats,
    };
  }

  return getCachedTaskSnapshot(userId);
});
