"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
            gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше (было cacheTime)
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Не делать запрос при монтировании, если данные свежие
            refetchOnReconnect: false, // Не делать запрос при переподключении
            retry: 1, // Количество повторных попыток при ошибке
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

