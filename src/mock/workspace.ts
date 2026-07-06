import type { WorkspaceSummary } from "@/types/workspace";

export const workspaceMock: WorkspaceSummary = {
  todaySuggestion: "继续完成今天成长记录",
  savingTime: "预计节约 12 分钟",
  progress: {
    label: "今日草稿",
    value: "3",
    caption: "等待老师确认",
  },
  recentEvents: [
    {
      id: "evt_001",
      title: "独立完成穿鞋",
      childName: "千千",
      timeLabel: "09:30",
    },
    {
      id: "evt_002",
      title: "午睡后情绪稳定",
      childName: "安安",
      timeLabel: "14:20",
    },
  ],
};
