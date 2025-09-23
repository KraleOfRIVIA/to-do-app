import { CompletedTasks } from "@/components/task/completed-task";
import { TaskCard } from "@/components/task/task-card";
import { TaskStatusStats } from "@/components/task/task-status";

const mockTasks: {
  title: string;
  description: string;
  priority: "Low" | "Moderate" | "High";
  status: "Not Started" | "In Progress" | "Completed";
  createdAt: string;
  image: string;
}[] = [
  {
    title: "Attend Nischal’s Birthday Party",
    description: "Buy gifts and cake from the bakery.",
    priority: "Moderate",
    status: "Not Started",
    createdAt: "20/06/2023",
    image: "/auth.png",
  },
  {
    title: "Landing Page Design for TravelDays",
    description: "Finish UI and send client updates.",
    priority: "Moderate",
    status: "In Progress",
    createdAt: "20/06/2023",
    image: "/auth.png",
  },
  {
    title: "Walk the dog",
    description: "Take the dog to the park and bring treats.",
    priority: "Low",
    status: "Completed",
    createdAt: "18/06/2023",
    image: "/auth.png",
  },
];

const completedTasks = [
  {
    title: "Walk the dog",
    description: "Take the dog to the park and bring treats as well.",
    image: "/dog.jpg",
    completedAgo: "2 days ago",
  },
  {
    title: "Conduct meeting",
    description: "Meet with the client and finalize requirements.",
    image: "/meeting.jpg",
    completedAgo: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая часть: To-Do */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-gray-400">📋</span>
              <span className="text-lg font-semibold text-red-400">To-Do</span>
              <button className="ml-auto text-sm text-red-400 hover:underline">+ Add task</button>
            </div>
            <div className="text-gray-400 text-sm mb-4">20 June &nbsp; - &nbsp; Today</div>
            <div className="flex flex-col gap-4">
              {mockTasks.map((task) => (
                <TaskCard key={task.title} {...task} />
              ))}
            </div>
          </div>
        </div>
        {/* Правая часть: Статистика и Completed */}
        <div className="flex flex-col gap-6">
          <TaskStatusStats completed={84} inProgress={46} notStarted={13} />
          <CompletedTasks tasks={completedTasks} />
        </div>
      </div>
    </div>
  );
}