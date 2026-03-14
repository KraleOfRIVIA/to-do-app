"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { useTasksContext } from "@/components/providers/tasks-provider";

const MAX_RESULTS = 8;
const SEARCH_ID = "topbar-task-search";

export default function SearchTask() {
  const { tasks } = useTasksContext();
  const t = useTranslations("Search");
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return tasks.slice(0, MAX_RESULTS);
    }

    return tasks
      .filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(normalizedQuery);
        const descriptionMatch = task.description?.toLowerCase().includes(normalizedQuery);

        return titleMatch || descriptionMatch;
      })
      .slice(0, MAX_RESULTS);
  }, [debouncedQuery, tasks]);

  const showResults = isFocused && query.trim().length > 0;
  const hasResults = filteredTasks.length > 0;

  return (
    <div className="relative w-full">
      <label htmlFor={SEARCH_ID} className="sr-only">
        {t("label")}
      </label>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={SEARCH_ID}
          type="search"
          autoComplete="off"
          placeholder={t("placeholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            hideTimeoutRef.current = setTimeout(() => setIsFocused(false), 150);
          }}
          aria-expanded={showResults}
          aria-controls={`${SEARCH_ID}-results`}
          className="h-10 rounded-xl bg-background pl-9 pr-3 shadow-sm"
        />
      </div>

      {showResults && hasResults ? (
        <ul
          id={`${SEARCH_ID}-results`}
          role="listbox"
          className="absolute left-0 right-0 top-12 z-50 max-h-[250px] overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg"
        >
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <Link
                href="/tasks"
                className="block truncate rounded-lg px-3 py-2 text-sm hover:bg-muted"
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
      ) : null}

      {showResults && !hasResults ? (
        <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-lg">
          {t("noResults")}
        </div>
      ) : null}
    </div>
  );
}
