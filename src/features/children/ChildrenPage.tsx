"use client";

import { useQuery } from "@tanstack/react-query";
import { ChildCard } from "@/components/ChildCard";
import { EmptyView } from "@/components/EmptyView";
import { LoadingView } from "@/components/LoadingView";
import { Section } from "@/components/Section";
import { getChildren } from "@/services/children";

export function ChildrenPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: getChildren,
  });

  return (
    <div className="space-y-[var(--space-6)]">
      <header className="space-y-[var(--space-2)]">
        <p className="text-[0.85rem] font-semibold uppercase leading-none text-primary">Classroom</p>
        <div className="space-y-[var(--space-1)]">
          <h1 className="text-[1.75rem] font-semibold leading-tight text-ink">Children</h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted">儿童列表和档案入口。</p>
        </div>
      </header>

      <Section title="中一班">
        {isLoading || !data ? (
          <LoadingView label="正在加载儿童列表" />
        ) : data.length > 0 ? (
          <div className="space-y-[var(--space-3)]">
            {data.map((child) => (
              <ChildCard child={child} key={child.id} />
            ))}
          </div>
        ) : (
          <EmptyView title="暂无儿童" description="Mock 数据会在这里显示儿童列表。" />
        )}
      </Section>
    </div>
  );
}
