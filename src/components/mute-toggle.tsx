"use client";

import { Volume2, VolumeX } from "lucide-react";

type MuteToggleProps = {
  muted: boolean;
  onToggle: () => void;
};

export function MuteToggle({ muted, onToggle }: MuteToggleProps) {
  return (
    <button
      type="button"
      data-testid="mute-toggle"
      data-muted={muted ? "true" : "false"}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={muted ? "Ativar som" : "Desativar som"}
      className="flex flex-col items-center gap-1 text-white"
    >
      <span
        className={
          muted
            ? "grid size-12 place-items-center rounded-full bg-black/35 ring-1 ring-white/15 backdrop-blur-md transition-transform active:scale-90"
            : "grid size-12 place-items-center rounded-full bg-amber-300 text-[#1a1208] ring-1 ring-amber-200 transition-transform active:scale-90"
        }
      >
        {muted ? <VolumeX className="size-6 drop-shadow-md" /> : <Volume2 className="size-6" />}
      </span>
      <span className="text-[11px] font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {muted ? "Mudo" : "Som"}
      </span>
    </button>
  );
}
