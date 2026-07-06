import { create } from "zustand";

type ReviewStore = {
  lastConfirmedDraftId: string | null;
  setLastConfirmedDraftId: (draftId: string) => void;
};

export const useReviewStore = create<ReviewStore>((set) => ({
  lastConfirmedDraftId: null,
  setLastConfirmedDraftId: (lastConfirmedDraftId) => set({ lastConfirmedDraftId }),
}));
