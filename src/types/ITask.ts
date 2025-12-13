type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Moderate" | "High";
  status: "Not Started" | "In Progress" | "Completed";
  createdAt: string;
  date: string | null;
  image?: string;
};
export default Task;