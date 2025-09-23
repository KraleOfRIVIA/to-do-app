import { FaCheckSquare } from "react-icons/fa";
import Image from "next/image";

interface CompletedTask {
  title: string;
  description: string;
  image: string;
  completedAgo: string; // например: "2 days ago"
}

interface CompletedTasksProps {
  tasks: CompletedTask[];
}

export function CompletedTasks({ tasks }: CompletedTasksProps) {
  return (
    <div className="bg-card rounded-xl shadow p-5">
      <div className="flex items-center gap-2 mb-4">
        <FaCheckSquare className="text-gray-400" />
        <span className="text-base font-medium text-red-400">Completed Task</span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="flex items-center border border-gray-200 rounded-xl p-4 bg-card"
          >
            {/* Статусный кружок */}
            <span className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </span>
            {/* Контент */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg mb-1">{task.title}</div>
              <div className="text-sm text-gray-500 mb-2">{task.description}</div>
              <div className="text-xs">
                <span className="text-green-600 font-medium">Status: Completed</span>
              </div>
              <div className="text-xs text-gray-400">Completed {task.completedAgo}.</div>
            </div>
            {/* Картинка */}
            <div className="ml-3 flex-shrink-0">
              <Image
                src={task.image}
                alt={task.title}
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}