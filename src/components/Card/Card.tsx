import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface p-[var(--space-4)] shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
