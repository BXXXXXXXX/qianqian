"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { Card } from "@/components/Card";
import { EmptyView } from "@/components/EmptyView";
import { LoadingView } from "@/components/LoadingView";
import { ProgressCard } from "@/components/ProgressCard";
import { Section } from "@/components/Section";
import { SuggestionCard } from "@/components/SuggestionCard";
import { VoiceButton } from "@/components/VoiceButton";
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
        <p className="text-[0.85rem] font-semibold uppercase leading-none text-primary">Project One Hour</p>
        <div className="space-y-[var(--space-1)]">
          <h1 className="text-[1.75rem] font-semibold leading-tight text-ink">Workspace</h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted">
            今天先做什么、后做什么，一眼看清，少想一步，少切一次。
          </p>
        </div>
      </header>

      {isLoading || !data ? (
        <LoadingView label="正在准备工作台" />
      ) : (
        <>
          <SuggestionCard title={data.todaySuggestion} helper={data.savingTime} />

          <div className="grid grid-cols-2 gap-[var(--space-3)]">
            <ProgressCard {...data.progress} />
            <ProgressCard
              label="Recent Facts"
              value={String(data.recentEvents.length)}
              caption="已记录的真实观察"
            />
          </div>

          <Section title="Today's Inbox">
            <div className="space-y-[var(--space-3)]">
              {data.inboxItems.map((item) => (
                <Card className="space-y-[var(--space-2)] shadow-none" key={item.id}>
                  <div className="flex items-center justify-between gap-[var(--space-3)]">
                    <h3 className="text-[1rem] font-semibold leading-snug text-ink">{item.title}</h3>
                    <span className="rounded-[var(--radius-pill)] bg-surface-muted px-3 py-1 text-[0.78rem] font-semibold text-primary">
                      {item.statusLabel}
                    </span>
                  </div>
                  <p className="text-[0.9rem] leading-relaxed text-ink-muted">{item.detail}</p>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Quick Capture">
            <Card className="flex flex-col items-center gap-[var(--space-4)] text-center">
              <VoiceButton
                onPressEnd={handlePressEnd}
                onPressStart={() => setVoiceState("pressed")}
                state={voiceState}
              />
              <div className="space-y-[var(--space-1)]">
                <p className="text-[1rem] font-semibold leading-snug text-ink">老师只描述事实</p>
                <p className="text-[0.9rem] leading-relaxed text-ink-muted">
                  按住开始，松开发送。系统再负责组织语言、整理草稿和进入下一步。
                </p>
              </div>
            </Card>
          </Section>

          <Section title="Recent Facts">
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
              <EmptyView
                title="还没有事实记录"
                description="今天的新观察会先沉淀在这里，再进入沟通和档案。"
              />
            )}
          </Section>
        </>
      )}
    </div>
  );
}
