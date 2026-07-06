export type Child = {
  id: string;
  name: string;
  avatarLabel: string;
  ageLabel: string;
  summary: string;
  focus: string;
};

export type ChildDetail = Child & {
  classroom: string;
  guardianNote: string;
  latestRecords: Array<{
    id: string;
    title: string;
    description: string;
    dateLabel: string;
  }>;
};
