import { create } from "zustand";

type WorkspaceStore = {
  activeDraftCount: number;
  setActiveDraftCount: (count: number) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeDraftCount: 0,
  setActiveDraftCount: (count) => set({ activeDraftCount: count }),
}));
