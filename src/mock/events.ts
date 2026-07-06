import type { MockEvent } from "@/types/events";

export const eventsMock: MockEvent[] = [
  {
    id: "evt_001",
    childId: "child_001",
    eventType: "Growth",
    title: "独立完成穿鞋",
    occurredAtLabel: "今天 09:30",
  },
  {
    id: "evt_002",
    childId: "child_002",
    eventType: "Emotion",
    title: "午睡后情绪稳定",
    occurredAtLabel: "今天 14:20",
  },
];
