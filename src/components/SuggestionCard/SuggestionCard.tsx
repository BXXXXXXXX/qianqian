import { ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";

export type SuggestionCardProps = {
  title: string;
  helper: string;
};

export function SuggestionCard({ title, helper }: SuggestionCardProps) {
  return (
    <Card className="flex items-center justify-between gap-[var(--space-4)] bg-[#fffaf0]">
      <div className="space-y-[var(--space-1)]">
        <p className="text-[0.82rem] font-medium text-ink-muted">今日建议</p>
        <h3 className="text-[1.05rem] font-semibold leading-snug text-ink">{title}</h3>
        <p className="text-[0.88rem] leading-relaxed text-ink-muted">{helper}</p>
      </div>
      <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
    </Card>
  );
}
