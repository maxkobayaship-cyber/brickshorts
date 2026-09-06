"use client";

import { Pause, Play } from "lucide-react";

type PauseToggleProps = {
  paused: boolean;
  onToggle: () => void;
};

export function PauseToggle({ paused, onToggle }: PauseToggleProps) {
  return (
    <button
      type="button"
      data-testid="pause-toggle"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? "Continuar clipe" : "Pausar clipe"}
      className="flex flex-col items-center gap-1 text-white"
    >
      <span className="grid size-12 place-items-center rounded-full bg-black/35 ring-1 ring-white/15 backdrop-blur-md transition-transform active:scale-90">
        {paused ? (
          <Play className="size-6 fill-white drop-shadow-md" />
        ) : (
          <Pause className="size-6 drop-shadow-md" />
        )}
      </span>
      <span className="text-[11px] font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {paused ? "Pausado" : "Pausa"}
      </span>
    </button>
  );
}
