import type Task from "@/types/ITask";

const statusKeyMap = {
  "Not Started": "notStarted",
  "In Progress": "inProgress",
  Completed: "completed",
} as const satisfies Record<Task["status"], string>;

const priorityKeyMap = {
  Low: "low",
  Moderate: "moderate",
  High: "high",
} as const satisfies Record<Task["priority"], string>;

export function getStatusKey(status: Task["status"]) {
  return statusKeyMap[status];
}

export function getPriorityKey(priority: Task["priority"]) {
  return priorityKeyMap[priority];
}
