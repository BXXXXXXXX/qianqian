export type MockEvent = {
  id: string;
  childId: string;
  eventType: "Growth" | "Health" | "Safety" | "Emotion" | "Routine" | "Communication";
  title: string;
  occurredAtLabel: string;
};
