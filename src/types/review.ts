export type ReviewDraft = {
  id: string;
  title: string;
  sourceText: string;
  factSummary: string;
  parentDraft: string;
  status: "draft" | "confirmed";
};
