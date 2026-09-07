"use client";

import { copy } from "@/copy/pt-BR";
import { cn } from "@/lib/utils";
import type { FeedCategory } from "@/types/short";

const OPTIONS: { id: FeedCategory; label: string }[] = [
  { id: "lego", label: copy.tabs.lego },
  { id: "celular", label: copy.tabs.celular },
  { id: "tech", label: copy.tabs.tech },
];

type CategorySwitchProps = {
  value: FeedCategory;
  onChange: (next: FeedCategory) => void;
};

export function CategorySwitch({ value, onChange }: CategorySwitchProps) {
  return (
    <div
      role="tablist"
      aria-label={copy.chooseFeed}
      className="pointer-events-auto flex rounded-full bg-black/45 p-0.5 ring-1 ring-white/15 backdrop-blur-md"
      data-testid="category-switch"
    >
      {OPTIONS.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            data-testid={`category-${option.id}`}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-12 min-w-11 rounded-full px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors sm:px-3 sm:text-[11px] sm:tracking-[0.12em]",
              active
                ? "bg-amber-300 text-[#1a1208]"
                : "text-white/80 hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
