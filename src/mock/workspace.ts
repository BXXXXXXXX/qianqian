import type { WorkspaceSummary } from "@/types/workspace";

export const workspaceMock: WorkspaceSummary = {
  todaySuggestion: "先完成今天的 2 条家长沟通",
  savingTime: "目标：每天还老师 1 小时",
  progress: {
    label: "Today's Inbox",
    value: "4",
    caption: "按顺序完成，减少来回切换",
  },
  inboxItems: [
    {
      id: "inbox_001",
      title: "完成 2 条家长沟通",
      detail: "基于已记录事实生成可编辑草稿",
      statusLabel: "优先",
    },
    {
      id: "inbox_002",
      title: "确认 1 条成长记录",
      detail: "千千今天的主动分享可进入成长档案",
      statusLabel: "处理中",
    },
    {
      id: "inbox_003",
      title: "查看 1 位新孩子档案",
      detail: "系统已根据第一次记录准备好基础档案",
      statusLabel: "待确认",
    },
  ],
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
