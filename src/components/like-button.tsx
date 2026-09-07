"use client";

import { Heart } from "lucide-react";
import { copy } from "@/copy/pt-BR";
import { formatCount } from "@/lib/likes";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  liked: boolean;
  count: number;
  onToggle: () => void;
};

export function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  return (
    <button
      type="button"
      data-testid="like-button"
      onClick={onToggle}
      aria-pressed={liked}
      aria-label={liked ? copy.unlike : copy.like}
      className="group flex flex-col items-center gap-1 text-white"
    >
      <span
        className={cn(
          "grid size-12 place-items-center rounded-full bg-black/35 ring-1 ring-white/15 backdrop-blur-md transition-transform group-active:scale-90",
          liked && "bg-[#d62828]/90 ring-[#d62828]",
        )}
      >
        <Heart
          className={cn(
            "size-6 drop-shadow-md transition-transform",
            liked && "fill-white scale-110 text-white",
          )}
        />
      </span>
      <span className="text-[11px] font-semibold tabular-nums drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {formatCount(count)}
      </span>
    </button>
  );
}
