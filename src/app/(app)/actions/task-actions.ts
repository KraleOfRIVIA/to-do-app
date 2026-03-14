"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { getUserTasksTag } from "@/lib/cache/cache-tags";
import prisma from "@/lib/prisma";

type ActionResult = {
  ok: boolean;
  message?: string;
};

type Priority = "Low" | "Moderate" | "High";
type Status = "Not Started" | "In Progress" | "Completed";

type AddTaskInput = {
  title: string;
  description?: string;
  date?: string | null;
  priority: Priority;
  status?: Status;
  image?: string;
};

type UpdateTaskInput = {
  id: string;
  title: string;
  description?: string;
  date?: string | null;
  priority: Priority;
  status: Status;
};

const validPriorities = new Set<Priority>(["Low", "Moderate", "High"]);
const validStatuses = new Set<Status>([
  "Not Started",
  "In Progress",
  "Completed",
]);

function parseOptionalDate(date?: string | null): Date | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}

function revalidateTaskRoutes(userId: string) {
  revalidatePath("/");
  revalidatePath("/tasks");
  revalidateTag(getUserTasksTag(userId));
}

export async function addTaskAction(input: AddTaskInput): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false, message: "Unauthorized" };
  }

  const title = input.title?.trim();
  if (!title) {
    return { ok: false, message: "Task title is required" };
  }

  if (!validPriorities.has(input.priority)) {
    return { ok: false, message: "Invalid task priority" };
  }

  const status: Status = input.status ?? "Not Started";
  if (!validStatuses.has(status)) {
    return { ok: false, message: "Invalid task status" };
  }

  await prisma.task.create({
    data: {
      title,
      description: input.description?.trim() || null,
      priority: input.priority,
      status,
      image: input.image ?? null,
      date: parseOptionalDate(input.date),
      userId,
    },
  });

  revalidateTaskRoutes(userId);
  return { ok: true };
}

export async function updateTaskAction(input: UpdateTaskInput): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false, message: "Unauthorized" };
  }

  const title = input.title?.trim();
  if (!title) {
    return { ok: false, message: "Task title is required" };
  }

  if (!validPriorities.has(input.priority)) {
    return { ok: false, message: "Invalid task priority" };
  }

  if (!validStatuses.has(input.status)) {
    return { ok: false, message: "Invalid task status" };
  }

  const result = await prisma.task.updateMany({
    where: {
      id: input.id,
      userId,
    },
    data: {
      title,
      description: input.description?.trim() || null,
      priority: input.priority,
      status: input.status,
      date: parseOptionalDate(input.date),
    },
  });

  if (result.count === 0) {
    return { ok: false, message: "Task not found" };
  }

  revalidateTaskRoutes(userId);
  return { ok: true };
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) {
    return { ok: false, message: "Unauthorized" };
  }

  const result = await prisma.task.deleteMany({
    where: {
      id,
      userId,
    },
  });

  if (result.count === 0) {
    return { ok: false, message: "Task not found" };
  }

  revalidateTaskRoutes(userId);
  return { ok: true };
}
