import type { Metadata } from "next";
import { AddTaskDialog } from "@/components/task/add-task";
import TasksList from "@/components/task/tasks-list";

export const metadata: Metadata = {
  title: "My Tasks | Task Manager",
  description: "View and manage all your tasks",
};

export default function TasksPage() {
  return (
    <div className="p-6">
      <AddTaskDialog />
      <TasksList />
    </div>
  );
}
