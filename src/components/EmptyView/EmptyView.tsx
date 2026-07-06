import { Card } from "@/components/Card";

export type EmptyViewProps = {
  title: string;
  description: string;
};

export function EmptyView({ title, description }: EmptyViewProps) {
  return (
    <Card className="border-dashed bg-transparent text-center shadow-none">
      <h3 className="text-[1rem] font-semibold leading-snug text-ink">{title}</h3>
      <p className="mt-[var(--space-2)] text-[0.9rem] leading-relaxed text-ink-muted">{description}</p>
    </Card>
  );
}
