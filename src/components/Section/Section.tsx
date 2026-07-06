import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  action?: ReactNode;
};

export function Section({ title, action, children, className, ...props }: SectionProps) {
  return (
    <section className={cn("space-y-[var(--space-3)]", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          {title ? <h2 className="text-[1rem] font-semibold leading-snug text-ink">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
