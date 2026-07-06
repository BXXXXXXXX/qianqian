"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/Card";
import { EmptyView } from "@/components/EmptyView";
import { LoadingView } from "@/components/LoadingView";
import { Section } from "@/components/Section";
import { routes } from "@/constants/routes";
import { getChildDetail } from "@/services/children";
import { useChildrenStore } from "@/store/childrenStore";

export type ChildDetailPageProps = {
  childId: string;
};

export function ChildDetailPage({ childId }: ChildDetailPageProps) {
  const setSelectedChildId = useChildrenStore((state) => state.setSelectedChildId);
  const { data, isLoading } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => getChildDetail(childId),
  });

  useEffect(() => {
    if (data) {
      setSelectedChildId(data.id);
    }
  }, [data, setSelectedChildId]);

  if (isLoading) {
    return <LoadingView label="正在加载儿童档案" />;
  }

  if (!data) {
    return <EmptyView title="未找到儿童" description="请返回儿童列表重新选择。" />;
  }

  return (
    <div className="space-y-[var(--space-6)]">
      <Link
        className="focus-ring inline-flex items-center gap-2 rounded-[var(--radius-pill)] text-[0.9rem] font-semibold text-primary"
        href={routes.children}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Children
      </Link>

      <header className="flex items-center gap-[var(--space-4)]">
        <div className="flex size-16 items-center justify-center rounded-[var(--radius-pill)] bg-surface-muted text-[1.25rem] font-semibold text-primary">
          {data.avatarLabel}
        </div>
        <div className="min-w-0">
          <p className="text-[0.85rem] font-semibold leading-none text-primary">{data.classroom}</p>
          <h1 className="mt-[var(--space-1)] truncate text-[1.75rem] font-semibold leading-tight text-ink">
            {data.name}
          </h1>
          <p className="mt-[var(--space-1)] text-[0.9rem] leading-normal text-ink-muted">{data.ageLabel}</p>
        </div>
      </header>

      <Card className="space-y-[var(--space-2)]">
        <p className="text-[0.82rem] font-medium text-ink-muted">当前关注</p>
        <h2 className="text-[1.05rem] font-semibold leading-snug text-ink">{data.focus}</h2>
        <p className="text-[0.9rem] leading-relaxed text-ink-muted">{data.guardianNote}</p>
      </Card>

      <Section title="Latest Records">
        <div className="space-y-[var(--space-3)]">
          {data.latestRecords.map((record) => (
            <Card className="shadow-none" key={record.id}>
              <p className="text-[0.8rem] font-medium text-primary">{record.dateLabel}</p>
              <h3 className="mt-[var(--space-1)] text-[1rem] font-semibold leading-snug text-ink">{record.title}</h3>
              <p className="mt-[var(--space-2)] text-[0.9rem] leading-relaxed text-ink-muted">
                {record.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
