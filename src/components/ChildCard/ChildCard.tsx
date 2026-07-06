import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";
import { routes } from "@/constants/routes";
import type { Child } from "@/types/children";

export type ChildCardProps = {
  child: Child;
};

export function ChildCard({ child }: ChildCardProps) {
  return (
    <Link className="focus-ring block rounded-card" href={routes.childDetail(child.id)}>
      <Card className="flex items-center gap-[var(--space-3)] shadow-none">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-surface-muted text-[1rem] font-semibold text-primary">
          {child.avatarLabel}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[1rem] font-semibold leading-snug text-ink">{child.name}</h3>
          <p className="truncate text-[0.85rem] leading-normal text-ink-muted">{child.summary}</p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
      </Card>
    </Link>
  );
}
