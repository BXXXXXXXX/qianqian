import { Card } from "@/components/Card";

export type ProgressCardProps = {
  label: string;
  value: string;
  caption: string;
};

export function ProgressCard({ label, value, caption }: ProgressCardProps) {
  return (
    <Card className="space-y-[var(--space-2)] shadow-none">
      <p className="text-[0.82rem] font-medium text-ink-muted">{label}</p>
      <p className="text-[1.5rem] font-semibold leading-tight text-ink">{value}</p>
      <p className="text-[0.85rem] leading-normal text-ink-muted">{caption}</p>
    </Card>
  );
}
