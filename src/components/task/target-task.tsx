import React from "react";
import Image from "next/image";
import  Task  from "@/types/ITask";
import { EditTaskDialog } from "./edit-task";

type TaskFullCardProps = {
  task: Task | null;
};

export const TargetTask: React.FC<TaskFullCardProps> = ({ task }) => (
  <div className="bg-background rounded-xl shadow p-6 border h-full w-full flex flex-col">
    {task ? (
      <>
        {task.image && (
          <div className="mb-4">
            <Image
              src={task.image}
              alt={task.title}
              width={400}
              height={120}
              className="rounded-lg object-cover w-full h-32"
            />
          </div>
        )}

        <h2 className="text-xl font-bold mb-2">{task.title}</h2>

        <div className="mb-2">
          <span className="font-semibold">Priority:</span>{" "}
          <span
            className={
              task.priority === "High"
                ? "text-red-600 font-bold"
                : task.priority === "Moderate"
                ? "text-yellow-600"
                : "text-green-600"
            }
          >
            {task.priority}
          </span>
        </div>

        <div className="mb-2">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={
              task.status === "Not Started"
                ? "text-red-500"
                : task.status === "In Progress"
                ? "text-yellow-500"
                : "text-green-500"
            }
          >
            {task.status}
          </span>
        </div>

        <div className="mb-2 text-sm text-gray-500">
          Created on: {task.createdAt}
        </div>

        {task.date && (
          <div className="mb-2 text-sm text-gray-500">
            Deadline: {task.date}
          </div>
        )}

        <div className="mb-2">
          <span className="font-semibold">Task Description:</span>
          <div className="mt-1">{task.description || "No description"}</div>
        </div>
        <div className="">
          <EditTaskDialog task={task}/>
        </div>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p>Select a task to view details</p>
      </div>
    )}
  </div>
);

export default TargetTask;
