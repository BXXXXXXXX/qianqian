"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Card } from "@/components/Card";
import { LoadingView } from "@/components/LoadingView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { Section } from "@/components/Section";
import { routes } from "@/constants/routes";
import { confirmReviewDraft, getReviewDraft } from "@/services/review";
import { useRecordStore } from "@/store/recordStore";
import { useReviewStore } from "@/store/reviewStore";

export function ReviewPage() {
  const router = useRouter();
  const setVoiceState = useRecordStore((state) => state.setVoiceState);
  const setLastConfirmedDraftId = useReviewStore((state) => state.setLastConfirmedDraftId);
  const { data, isLoading } = useQuery({
    queryKey: ["review-draft"],
    queryFn: getReviewDraft,
  });

  async function handleConfirm() {
    if (!data) return;

    await confirmReviewDraft();
    setLastConfirmedDraftId(data.id);
    setVoiceState("released");
    router.push(routes.workspace);
  }

  if (isLoading || !data) {
    return <LoadingView label="正在准备草稿" />;
  }

  return (
    <div className="space-y-[var(--space-6)]">
      <header className="space-y-[var(--space-2)]">
        <p className="text-[0.85rem] font-semibold uppercase leading-none text-primary">Review</p>
        <div className="space-y-[var(--space-1)]">
          <h1 className="text-[1.75rem] font-semibold leading-tight text-ink">{data.title}</h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted">确认前只展示 Mock 草稿，不接入 AI。</p>
        </div>
      </header>

      <Section title="Source">
        <Card className="shadow-none">
          <p className="text-[0.95rem] leading-relaxed text-ink">{data.sourceText}</p>
        </Card>
      </Section>

      <Section title="Fact Summary">
        <Card className="bg-surface-muted shadow-none">
          <p className="text-[0.95rem] leading-relaxed text-ink">{data.factSummary}</p>
        </Card>
      </Section>

      <Section title="Draft">
        <Card>
          <p className="text-[0.95rem] leading-relaxed text-ink">{data.parentDraft}</p>
        </Card>
      </Section>

      <div className="grid grid-cols-2 gap-[var(--space-3)]">
        <SecondaryButton onClick={() => router.push(routes.workspace)}>返回</SecondaryButton>
        <PrimaryButton icon={<Check className="size-4" aria-hidden="true" />} onClick={handleConfirm}>
          确认
        </PrimaryButton>
      </div>
    </div>
  );
}
