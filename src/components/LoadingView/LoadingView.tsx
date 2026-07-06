import { LoaderCircle } from "lucide-react";

export type LoadingViewProps = {
  label?: string;
};

export function LoadingView({ label = "加载中" }: LoadingViewProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-[var(--space-3)] text-ink-muted">
      <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
      <p className="text-[0.9rem] leading-normal">{label}</p>
    </div>
  );
}
