import { create } from "zustand";

type ChildrenStore = {
  selectedChildId: string | null;
  setSelectedChildId: (childId: string) => void;
};

export const useChildrenStore = create<ChildrenStore>((set) => ({
  selectedChildId: null,
  setSelectedChildId: (selectedChildId) => set({ selectedChildId }),
}));
