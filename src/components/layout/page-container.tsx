import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return <section className={cn("mx-auto w-full max-w-7xl", className)}>{children}</section>;
}
