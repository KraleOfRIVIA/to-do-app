type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Moderate" | "High";
  status: "Not Started" | "In Progress" | "Completed";
  createdAt: string;
  date?: string;
  image?: string;
};
export default Task;