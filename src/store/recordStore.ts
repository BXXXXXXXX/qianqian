import { create } from "zustand";
import type { VoiceButtonState } from "@/components/VoiceButton";

type RecordStore = {
  voiceState: VoiceButtonState;
  setVoiceState: (state: VoiceButtonState) => void;
};

export const useRecordStore = create<RecordStore>((set) => ({
  voiceState: "released",
  setVoiceState: (voiceState) => set({ voiceState }),
}));
