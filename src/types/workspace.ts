export type WorkspaceSummary = {
  todaySuggestion: string;
  savingTime: string;
  recentEvents: WorkspaceEvent[];
  inboxItems: WorkspaceInboxItem[];
  progress: {
    label: string;
    value: string;
    caption: string;
  };
};

export type WorkspaceEvent = {
  id: string;
  title: string;
  childName: string;
  timeLabel: string;
};

export type WorkspaceInboxItem = {
  id: string;
  title: string;
  detail: string;
  statusLabel: string;
};
