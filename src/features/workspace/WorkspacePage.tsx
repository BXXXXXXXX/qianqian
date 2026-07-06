"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { EmptyView } from "@/components/EmptyView";
import { LoadingView } from "@/components/LoadingView";
import { ProgressCard } from "@/components/ProgressCard";
import { Section } from "@/components/Section";
import { SuggestionCard } from "@/components/SuggestionCard";
import { VoiceButton } from "@/components/VoiceButton";
import { Card } from "@/components/Card";
import { routes } from "@/constants/routes";
import { submitMockRecording } from "@/services/record";
import { getWorkspaceSummary } from "@/services/workspace";
import { useRecordStore } from "@/store/recordStore";

export function WorkspacePage() {
  const router = useRouter();
  const voiceState = useRecordStore((state) => state.voiceState);
  const setVoiceState = useRecordStore((state) => state.setVoiceState);
  const { data, isLoading } = useQuery({
    queryKey: ["workspace"],
    queryFn: getWorkspaceSummary,
  });

  async function handlePressEnd() {
    if (voiceState !== "pressed") return;

    setVoiceState("loading");
    await submitMockRecording();
    router.push(routes.review);
  }

  return (
    <div className="space-y-[var(--space-6)]">
      <header className="space-y-[var(--space-2)]">
        <p className="text-[0.85rem] font-semibold uppercase leading-none text-primary">KTOS</p>
        <div className="space-y-[var(--space-1)]">
          <h1 className="text-[1.75rem] font-semibold leading-tight text-ink">Workspace</h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted">今天的记录、草稿和待确认事项。</p>
        </div>
      </header>

      {isLoading || !data ? (
        <LoadingView label="正在准备工作台" />
      ) : (
        <>
          <SuggestionCard title={data.todaySuggestion} helper={data.savingTime} />

          <div className="grid grid-cols-2 gap-[var(--space-3)]">
            <ProgressCard {...data.progress} />
            <ProgressCard label="最近事件" value={String(data.recentEvents.length)} caption="来自 Mock Data" />
          </div>

          <Section title="Quick Capture">
            <Card className="flex flex-col items-center gap-[var(--space-4)] text-center">
              <VoiceButton
                onPressEnd={handlePressEnd}
                onPressStart={() => setVoiceState("pressed")}
                state={voiceState}
              />
              <div className="space-y-[var(--space-1)]">
                <p className="text-[1rem] font-semibold leading-snug text-ink">按住开始，松开发送</p>
                <p className="text-[0.9rem] leading-relaxed text-ink-muted">当前仅模拟 Pressed、Released、Loading 状态。</p>
              </div>
            </Card>
          </Section>

          <Section title="Recent Events">
            {data.recentEvents.length > 0 ? (
              <div className="space-y-[var(--space-3)]">
                {data.recentEvents.map((event) => (
                  <Card className="flex items-start gap-[var(--space-3)] shadow-none" key={event.id}>
                    <div className="mt-[var(--space-1)] rounded-[var(--radius-pill)] bg-surface-muted p-[var(--space-2)] text-primary">
                      <ClipboardList className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[1rem] font-semibold leading-snug text-ink">{event.title}</h3>
                      <p className="text-[0.85rem] leading-normal text-ink-muted">
                        {event.childName} · {event.timeLabel}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyView title="还没有事件" description="今天的记录会出现在这里。" />
            )}
          </Section>
        </>
      )}
    </div>
  );
}
