import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export function SecondaryButton({
  children,
  className,
  icon,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-line bg-surface px-5 text-[0.95rem] font-semibold leading-none text-ink transition hover:bg-surface-muted",
        className,
      )}
      type="button"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
