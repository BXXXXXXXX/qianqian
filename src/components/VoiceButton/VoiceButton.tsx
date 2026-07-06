"use client";

import { LoaderCircle, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type VoiceButtonState = "released" | "pressed" | "loading";

export type VoiceButtonProps = {
  state: VoiceButtonState;
  onPressStart: () => void;
  onPressEnd: () => void;
  className?: string;
};

const labelByState: Record<VoiceButtonState, string> = {
  released: "按住记录",
  pressed: "松开发送",
  loading: "整理中",
};

export function VoiceButton({ state, onPressStart, onPressEnd, className }: VoiceButtonProps) {
  const isPressed = state === "pressed";
  const isLoading = state === "loading";

  return (
    <button
      aria-label={labelByState[state]}
      className={cn(
        "focus-ring flex aspect-square w-28 select-none flex-col items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-line bg-primary text-primary-ink shadow-card transition",
        isPressed && "scale-95 bg-[#1d4b3b]",
        isLoading && "bg-ink",
        className,
      )}
      disabled={isLoading}
      onPointerCancel={onPressEnd}
      onPointerDown={onPressStart}
      onPointerLeave={() => {
        if (isPressed) onPressEnd();
      }}
      onPointerUp={onPressEnd}
      type="button"
    >
      {isLoading ? (
        <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
      ) : (
        <Mic className="size-7" aria-hidden="true" />
      )}
      <span className="text-[0.85rem] font-semibold leading-none">{labelByState[state]}</span>
    </button>
  );
}
