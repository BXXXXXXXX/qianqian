import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  isLoading?: boolean;
};

export function PrimaryButton({
  children,
  className,
  icon,
  isLoading = false,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-primary px-5 text-[0.95rem] font-semibold leading-none text-primary-ink transition disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={disabled || isLoading}
      type="button"
      {...props}
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}
