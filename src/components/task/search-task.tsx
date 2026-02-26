"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useTasksContext } from "@/components/providers/tasks-provider";

export default function SearchTask() {
  const { tasks } = useTasksContext();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const filteredTasks = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return tasks;
    }

    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, tasks]);

  return (
    <div className="relative w-full max-w-[400px]">
      {/* Поисковое поле */}
      <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow px-3 h-10">
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} // чтобы успел клик по варианту
          className="flex-1 bg-transparent border-none outline-none text-sm px-2"
        />
        <Search className="text-foreground" size={18} />
      </div>

      {/* Выпадающий список результатов */}
      {isFocused && query.trim() && filteredTasks.length > 0 && (
        <ul className="absolute z-50 top-12 left-0 right-0 bg-card border border-border rounded-lg shadow-lg max-h-[250px] overflow-y-auto">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <Link
                href={`/tasks/${task.id}`}
                className="block px-4 py-2 hover:bg-muted text-sm truncate"
                onClick={() => {
                  setQuery("");
                  setIsFocused(false);
                }}
              >
                {task.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Если ничего не найдено */}
      {isFocused && query.trim() && filteredTasks.length === 0 && (
        <div className="absolute z-50 top-12 left-0 right-0 bg-card border border-border rounded-lg shadow-lg px-4 py-2 text-sm text-muted-foreground">
          No tasks found
        </div>
      )}
    </div>
  );
}
