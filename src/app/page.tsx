import { TaskCard } from "@/components/task-card";

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
    image: "/cake.jpg",
  },
  {
    title: "Landing Page Design for TravelDays",
    description: "Finish UI and send client updates.",
    priority: "Moderate",
    status: "In Progress",
    createdAt: "20/06/2023",
    image: "/laptop.jpg",
  },
  {
    title: "Walk the dog",
    description: "Take the dog to the park and bring treats.",
    priority: "Low",
    status: "Completed",
    createdAt: "18/06/2023",
    image: "/dog.jpg",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockTasks.map((task) => (
        <TaskCard key={task.title} {...task} />
      ))}
    </div>
  );
}