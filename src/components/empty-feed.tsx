import { Boxes } from "lucide-react";
import { copy } from "@/copy/pt-BR";

export function EmptyFeed() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-white">
      <span className="grid size-16 place-items-center rounded-2xl bg-white/8 ring-1 ring-white/15">
        <Boxes className="size-8 text-amber-300" />
      </span>
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">{copy.emptyTitle}</h2>
        <p className="max-w-[16rem] text-sm leading-relaxed text-white/70">
          {copy.emptyBody}
        </p>
      </div>
    </div>
  );
}
