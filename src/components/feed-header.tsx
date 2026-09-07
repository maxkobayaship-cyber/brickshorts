"use client";

import { Volume2 } from "lucide-react";
import { CategorySwitch } from "@/components/category-switch";
import { copy } from "@/copy/pt-BR";
import type { FeedCategory } from "@/types/short";

type FeedHeaderProps = {
  category: FeedCategory;
  onCategoryChange: (next: FeedCategory) => void;
  muted: boolean;
  onMute: () => void;
};

export function FeedHeader({ category, onCategoryChange, muted, onMute }: FeedHeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
      <div className="flex min-w-0 items-center gap-2.5">
        <StudMark />
        <div className="min-w-0 leading-tight">
          <p className="font-heading text-[1.35rem] font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {copy.appName}
          </p>
          <p className="text-[11px] font-medium tracking-wide text-white/75">
            {copy.subtitles[category]}
          </p>
          {!muted ? (
            <button
              type="button"
              data-testid="sound-on-badge"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onMute}
              aria-label={copy.disableSound}
              className="pointer-events-auto mt-1 inline-flex min-h-12 items-center gap-1.5 rounded-full bg-amber-300 px-3 text-[11px] font-semibold text-[#1a1208]"
            >
              <Volume2 className="size-3.5" />
              {copy.soundOn}
            </button>
          ) : null}
        </div>
      </div>
      <CategorySwitch value={category} onChange={onCategoryChange} />
    </header>
  );
}

function StudMark() {
  return (
    <span
      aria-hidden
      className="grid grid-cols-2 gap-0.5 rounded-[7px] bg-[#1a1208]/70 p-1 ring-1 ring-white/20 backdrop-blur-md"
    >
      <span className="size-2.5 rounded-full bg-[#d62828] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
      <span className="size-2.5 rounded-full bg-[#f5c518] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
      <span className="size-2.5 rounded-full bg-[#1e5aa8] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
      <span className="size-2.5 rounded-full bg-[#2e8b57] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
    </span>
  );
}
