import type { ReviewDraft } from "@/types/review";

export const reviewMock: ReviewDraft = {
  id: "draft_001",
  title: "成长记录草稿",
  sourceText: "千千今天自己把鞋子穿好了，还提醒旁边的小朋友把鞋带放进去。",
  factSummary: "独立完成穿鞋；主动提醒同伴注意鞋带。",
  parentDraft:
    "今天千千在生活自理方面有一个很具体的进步：她自己完成了穿鞋，还主动提醒旁边的小朋友把鞋带放好。老师会继续鼓励她把这种细心和主动性保持下去。",
  status: "draft",
};
