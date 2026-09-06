"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyFeed } from "@/components/empty-feed";
import { FeedHeader } from "@/components/feed-header";
import { LikeButton } from "@/components/like-button";
import { MuteToggle } from "@/components/mute-toggle";
import { PauseToggle } from "@/components/pause-toggle";
import { VideoCard } from "@/components/video-card";
import { CATALOG_META } from "@/data/catalog";
import { useLikes } from "@/hooks/use-likes";
import type { BrickShort, FeedCategory } from "@/types/short";

const WINDOW = 2;

type VideoFeedProps = {
  shorts: BrickShort[];
  category: FeedCategory;
  onCategoryChange: (next: FeedCategory) => void;
};

export function VideoFeed({ shorts, category, onCategoryChange }: VideoFeedProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const current = shorts[index];
  const likes = useLikes(current?.id ?? "none", current?.likes ?? 0);
  const meta = CATALOG_META[category];

  const goTo = useCallback(
    (next: number) => {
      if (shorts.length === 0) return;
      const clamped = Math.max(0, Math.min(shorts.length - 1, next));
      indexRef.current = clamped;
      setIndex(clamped);
      setPaused(false);
      setHintVisible(false);
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollTo({
        top: clamped * scroller.clientHeight,
        behavior: "smooth",
      });
    },
    [shorts.length],
  );

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    setPaused(false);
    setHintVisible(true);
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [category]);

  useEffect(() => {
    document.documentElement.dataset.brickshorts = "ready";
    let wheelLock = 0;

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        goTo(indexRef.current + 1);
      } else if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        goTo(indexRef.current - 1);
      } else if (event.key === "m") {
        setMuted((value) => !value);
      } else if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
      }
    }

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) < 10) return;
      event.preventDefault();
      const now = Date.now();
      if (now < wheelLock) return;
      wheelLock = now + 520;
      goTo(indexRef.current + (event.deltaY > 0 ? 1 : -1));
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      delete document.documentElement.dataset.brickshorts;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [goTo]);

  if (shorts.length === 0) {
    return (
      <div className="relative h-full w-full bg-[#120c07]">
        <FeedHeader category={category} onCategoryChange={onCategoryChange} />
        <EmptyFeed />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black" data-testid="brickshorts-feed">
      <FeedHeader category={category} onCategoryChange={onCategoryChange} />
      <div
        ref={scrollerRef}
        data-testid="feed-scroller"
        className="feed-scroll h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
        onScroll={() => {
          const scroller = scrollerRef.current;
          if (!scroller || scroller.clientHeight === 0) return;
          const next = Math.round(scroller.scrollTop / scroller.clientHeight);
          if (next === indexRef.current) return;
          indexRef.current = next;
          setIndex(next);
          setPaused(false);
          setHintVisible(false);
        }}
      >
        {shorts.map((short, cardIndex) => (
          <section key={`${category}-${short.id}`} className="feed-slide w-full">
            {Math.abs(cardIndex - index) <= WINDOW ? (
              <VideoCard
                short={short}
                active={cardIndex === index}
                muted={muted}
                paused={paused}
                onTogglePause={() => setPaused((value) => !value)}
                showHint={hintVisible && cardIndex === 0}
              />
            ) : (
              <div className="h-full w-full bg-black" aria-hidden />
            )}
          </section>
        ))}
      </div>

      <p className="pointer-events-none absolute top-[max(4.6rem,calc(env(safe-area-inset-top)+3.4rem))] right-4 z-30 text-[11px] font-semibold tracking-wide text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {index + 1}/{shorts.length}
        {meta.rotated > 0 ? (
          <span className="mt-0.5 block text-[10px] font-medium text-white/55">
            {meta.uniqueSources} únicos
          </span>
        ) : null}
      </p>

      <div className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-4">
        <LikeButton liked={likes.liked} count={likes.count} onToggle={likes.toggle} />
        <MuteToggle muted={muted} onToggle={() => setMuted((value) => !value)} />
        <PauseToggle paused={paused} onToggle={() => setPaused((value) => !value)} />
      </div>

      <div className="absolute top-1/2 left-3 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        <button
          type="button"
          data-testid="prev-clip"
          aria-label="Clipe anterior"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
          className="grid size-10 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-md disabled:opacity-30"
        >
          <ChevronUp className="size-5" />
        </button>
        <button
          type="button"
          data-testid="next-clip"
          aria-label="Próximo clipe"
          disabled={index === shorts.length - 1}
          onClick={() => goTo(index + 1)}
          className="grid size-10 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-md disabled:opacity-30"
        >
          <ChevronDown className="size-5" />
        </button>
      </div>
    </div>
  );
}
