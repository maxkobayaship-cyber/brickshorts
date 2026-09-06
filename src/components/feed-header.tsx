export function FeedHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2.5">
        <StudMark />
        <div className="leading-tight">
          <p className="font-heading text-[1.35rem] font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            BrickShorts
          </p>
          <p className="text-[11px] font-medium tracking-wide text-white/75">
            clips de tijolos
          </p>
        </div>
      </div>
      <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200 ring-1 ring-white/15 backdrop-blur-md">
        Para ti
      </span>
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
