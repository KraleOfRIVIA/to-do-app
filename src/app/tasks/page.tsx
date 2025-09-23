"use client";

import { useState } from "react";
import { TaskCard } from "@/components/task/task-card"; // твой обновлённый компонент
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Moderate" | "High" | "Extreme";
  status: "Not Started" | "In Progress" | "Completed";
  createdAt: string;
  image?: string;
  objective?: string;
  notes?: string[];
  deadline?: string;
};

const tasks: Task[] = [
  {
    id: "1",
    title: "Submit Documents",
    description: "Make sure to submit all the necessary documents...",
    priority: "Extreme",
    status: "Not Started",
    createdAt: "20/06/2023",
    image: "https://static.wikia.nocookie.net/dota2_gamepedia/images/1/12/Marci_icon.png/revision/latest?cb=20211029000514",
    objective: "To submit required documents for something important",
    notes: [
      "Ensure that the documents are authentic and up-to-date.",
      "Maintain confidentiality and security of sensitive information.",
      "Follow guidelines and deadlines strictly.",
    ],
    deadline: "End of Day",
  },
  {
    id: "2",
    title: "Complete Assignments",
    description: "The assignments must be completed to pass final year...",
    priority: "Moderate",
    status: "In Progress",
    createdAt: "20/06/2023",
     image: "https://static.wikia.nocookie.net/dota2_gamepedia/images/1/12/Marci_icon.png/revision/latest?cb=20211029000514",
    objective: "Finish all assignments for final evaluation",
    notes: ["Focus on core topics", "Cross-check before submission"],
    deadline: "Next Monday",
  },
];

export default function MyTasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0]);

  return (
    <div className="flex gap-4 p-6">
      {/* Список задач */}
      <div className="w-1/3 space-y-3">
        <h2 className="font-semibold text-xl mb-2">My Tasks</h2>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            selected={selectedTask?.id === task.id}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>

      {/* Детали выбранной задачи */}
      <div className="flex-1">
        {selectedTask ? (
          <Card className="p-5 rounded-xl shadow-md">
            {/* Изображение */}
            {selectedTask.image && (
              <div className="mb-4">
                <Image
                  src={selectedTask.image}
                  alt={selectedTask.title}
                  className="rounded-lg object-cover"
                  width={300}
                  height={160}
                />
              </div>
            )}

            <h3 className="text-lg font-semibold">
              {selectedTask.title}
            </h3>
            <p className="text-sm text-gray-500">
              Priority:{" "}
              <span className="font-medium">{selectedTask.priority}</span> | Status:{" "}
              <span className="font-medium">{selectedTask.status}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Task Title:</span>{" "}
              {selectedTask.title}
              <br />
              <span className="font-medium">Objective:</span>{" "}
              {selectedTask.objective}
              <br />
              <span className="font-medium">Task Description:</span>{" "}
              {selectedTask.description}
            </p>

            {selectedTask.notes && (
              <>
                <p className="font-medium mb-2">Additional Notes:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {selectedTask.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedTask.deadline && (
              <p className="text-sm">
                <span className="font-medium">Deadline for Submission:</span>{" "}
                {selectedTask.deadline}
              </p>
            )}
          </Card>
        ) : (
          <p className="text-gray-400">Select a task to view details</p>
        )}
      </div>
    </div>
  );
}
