/* eslint-disable no-console */
"use strict";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PRIORITIES = ["Low", "Moderate", "High"];
const STATUSES = ["Not Started", "In Progress", "Completed"];

const ACTIONS = [
  "Review",
  "Prepare",
  "Update",
  "Plan",
  "Refactor",
  "Deploy",
  "Document",
  "Validate",
  "Design",
  "Optimize",
];

const SUBJECTS = [
  "project board",
  "database index",
  "API contract",
  "task workflow",
  "notifications flow",
  "release checklist",
  "auth integration",
  "dashboard widgets",
  "report template",
  "search filters",
];

const NOTES = [
  "Need to coordinate with QA before final release.",
  "Double-check edge cases and empty states.",
  "Include logging for easier troubleshooting.",
  "Track performance impact after deployment.",
  "Align implementation with product requirements.",
  "Confirm analytics events are emitted correctly.",
  "Discuss possible optimizations during code review.",
  "Test behavior on mobile and desktop.",
  "Validate permissions before enabling for all users.",
  "Prepare rollback plan in case of regressions.",
];

const DAY_MS = 24 * 60 * 60 * 1000;

function getIntArg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;

  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid value for ${flag}: ${process.argv[index + 1]}`);
  }

  return value;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(values) {
  return values[randomInt(0, values.length - 1)];
}

function randomDateBetween(start, end) {
  const min = start.getTime();
  const max = end.getTime();
  return new Date(randomInt(min, max));
}

function buildTaskData(userId, sequence) {
  const status = pickRandom(STATUSES);
  const priority = pickRandom(PRIORITIES);

  const now = new Date();
  const createdAt = randomDateBetween(
    new Date(now.getTime() - 180 * DAY_MS),
    new Date(now.getTime() - 1 * DAY_MS)
  );

  let dueDate = randomDateBetween(
    new Date(now.getTime() - 30 * DAY_MS),
    new Date(now.getTime() + 45 * DAY_MS)
  );

  if (status === "Completed" && dueDate.getTime() > now.getTime()) {
    dueDate = randomDateBetween(
      new Date(now.getTime() - 30 * DAY_MS),
      new Date(now.getTime() - 1 * DAY_MS)
    );
  }

  if (status !== "Completed" && Math.random() < 0.25) {
    dueDate = null;
  }

  const title = `${pickRandom(ACTIONS)} ${pickRandom(SUBJECTS)} #${sequence}`;
  const description =
    Math.random() < 0.85 ? `${pickRandom(NOTES)} (mock:${sequence})` : null;

  return {
    userId,
    title,
    description,
    priority,
    status,
    createdAt,
    date: dueDate,
  };
}

async function createMockUsers(usersToCreate) {
  const users = Array.from({ length: usersToCreate }, (_, i) => ({
    email: `mock-user-${i + 1}@example.local`,
    name: `Mock User ${i + 1}`,
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  return prisma.user.findMany({
    where: {
      email: {
        startsWith: "mock-user-",
      },
    },
    select: {
      id: true,
      email: true,
    },
    orderBy: {
      email: "asc",
    },
  });
}

async function main() {
  const usersToCreate = getIntArg("--users", 40);
  const tasksPerUser = getIntArg("--tasks-per-user", 400);
  const batchSize = getIntArg("--batch-size", 1000);
  const resetMock = hasFlag("--reset-mock");
  const includeExistingUsers = !hasFlag("--only-mock-users");

  console.log("Seed config:");
  console.log(`- users to ensure: ${usersToCreate}`);
  console.log(`- tasks per user: ${tasksPerUser}`);
  console.log(`- batch size: ${batchSize}`);
  console.log(`- reset mock users: ${resetMock}`);
  console.log(`- include existing users: ${includeExistingUsers}`);

  if (resetMock) {
    console.log("Cleaning old mock users and tasks...");
    await prisma.task.deleteMany({
      where: {
        user: {
          email: {
            startsWith: "mock-user-",
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "mock-user-",
        },
      },
    });
  }

  const mockUsers = await createMockUsers(usersToCreate);

  const existingUsers = includeExistingUsers
    ? await prisma.user.findMany({
        where: {
          email: {
            not: {
              startsWith: "mock-user-",
            },
          },
        },
        select: {
          id: true,
          email: true,
        },
      })
    : [];

  const byId = new Map();
  for (const user of [...existingUsers, ...mockUsers]) {
    byId.set(user.id, user);
  }
  const targetUsers = [...byId.values()];

  if (targetUsers.length === 0) {
    throw new Error("No users found to seed tasks for.");
  }

  const totalTasks = targetUsers.length * tasksPerUser;
  console.log(`Target users: ${targetUsers.length}`);
  console.log(`Total tasks to create: ${totalTasks}`);

  let inserted = 0;
  let sequence = 1;
  let chunk = [];

  for (const user of targetUsers) {
    for (let i = 0; i < tasksPerUser; i += 1) {
      chunk.push(buildTaskData(user.id, sequence));
      sequence += 1;

      if (chunk.length >= batchSize) {
        await prisma.task.createMany({ data: chunk });
        inserted += chunk.length;
        console.log(`Inserted ${inserted}/${totalTasks} tasks...`);
        chunk = [];
      }
    }
  }

  if (chunk.length > 0) {
    await prisma.task.createMany({ data: chunk });
    inserted += chunk.length;
  }

  console.log(`Done. Inserted ${inserted} tasks.`);
}

main()
  .catch((error) => {
    console.error("Mock seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
