"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EmptyFeed } from "@/components/empty-feed";
import { FeedHeader } from "@/components/feed-header";
import { LikeButton } from "@/components/like-button";
import { MuteToggle } from "@/components/mute-toggle";
import { PauseToggle } from "@/components/pause-toggle";
import { SkipToast } from "@/components/skip-toast";
import { VideoCard } from "@/components/video-card";
import { copy } from "@/copy/pt-BR";
import { useLikes } from "@/hooks/use-likes";
import { playActiveClip, silenceAllVideos } from "@/lib/audio";
import { mountedIndexes, preloadFor } from "@/lib/media";
import {
  clearBadClip,
  markBadClip,
  readBadClips,
  writeMutedPreference,
} from "@/lib/session";
import { shuffleList, uniqueByClip } from "@/lib/shuffle";
import type { BrickShort, FeedCategory } from "@/types/short";

type VideoFeedProps = {
  shorts: BrickShort[];
  category: FeedCategory;
  onCategoryChange: (next: FeedCategory) => void;
};

export function VideoFeed({ shorts, category, onCategoryChange }: VideoFeedProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const mutedRef = useRef(true);
  const directionRef = useRef<-1 | 0 | 1>(0);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const skipTimer = useRef<number>(0);
  const [items] = useState(() => shuffleList(uniqueByClip(shorts)));
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [toast, setToast] = useState(false);

  const setActiveVideo = useCallback((video: HTMLVideoElement | null) => {
    activeVideoRef.current = video;
    if (video) {
      playActiveClip(video, mutedRef.current);
    }
  }, []);

  const applyMutePreference = useCallback((nextMuted: boolean) => {
    mutedRef.current = nextMuted;
    writeMutedPreference(nextMuted);
    setMuted(nextMuted);
    const active = activeVideoRef.current;
    if (!active) return;
    playActiveClip(active, nextMuted);
  }, []);

  const handleCategoryChange = useCallback(
    (next: FeedCategory) => {
      if (next === category) return;
      silenceAllVideos(scrollerRef.current);
      silenceAllVideos(document);
      mutedRef.current = true;
      writeMutedPreference(true);
      setMuted(true);
      onCategoryChange(next);
    },
    [category, onCategoryChange],
  );

  const current = items[index];
  const likes = useLikes(current?.id ?? "none", current?.likes ?? 0);
  const mounted = mountedIndexes(index, items.length, direction);

  const goTo = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      directionRef.current = clamped === indexRef.current ? 0 : clamped > indexRef.current ? 1 : -1;
      setDirection(directionRef.current);
      silenceAllVideos(scrollerRef.current);
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
      requestAnimationFrame(() => {
        playActiveClip(activeVideoRef.current, mutedRef.current);
      });
    },
    [items.length],
  );

  const skipFailed = useCallback(
    (id: string) => {
      markBadClip(id);
      setToast(true);
      window.clearTimeout(skipTimer.current);
      skipTimer.current = window.setTimeout(() => setToast(false), 2200);
      const bad = readBadClips();
      let cursor = indexRef.current + 1;
      let hops = 0;
      while (hops < items.length && items[cursor] && bad.has(items[cursor].id)) {
        cursor += 1;
        hops += 1;
      }
      if (cursor < items.length) {
        goTo(cursor);
      }
    },
    [goTo, items],
  );

  useLayoutEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
    silenceAllVideos(document);
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
      } else if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        applyMutePreference(!mutedRef.current);
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
      window.clearTimeout(skipTimer.current);
      silenceAllVideos(document);
    };
  }, [applyMutePreference, goTo]);

  if (items.length === 0) {
    return (
      <div className="relative h-full w-full bg-[#1a1208]">
        <FeedHeader
          category={category}
          onCategoryChange={handleCategoryChange}
          muted={muted}
          onMute={() => applyMutePreference(true)}
        />
        <EmptyFeed />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full bg-[#1a1208]"
      data-testid="brickshorts-feed"
      data-muted={muted ? "true" : "false"}
    >
      <FeedHeader
        category={category}
        onCategoryChange={handleCategoryChange}
        muted={muted}
        onMute={() => applyMutePreference(true)}
      />
      <div
        ref={scrollerRef}
        data-testid="feed-scroller"
        className="feed-scroll h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
        onScroll={() => {
          const scroller = scrollerRef.current;
          if (!scroller || scroller.clientHeight === 0) return;
          const next = Math.round(scroller.scrollTop / scroller.clientHeight);
          if (next === indexRef.current) return;
          directionRef.current = next > indexRef.current ? 1 : -1;
          setDirection(directionRef.current);
          silenceAllVideos(scroller);
          indexRef.current = next;
          setIndex(next);
          setPaused(false);
          setHintVisible(false);
        }}
      >
        {items.map((short, cardIndex) => {
          const attached = mounted.has(cardIndex);
          return (
            <section key={`${category}-${short.id}`} className="feed-slide w-full">
              {attached || cardIndex === index ? (
                <VideoCard
                  key={`${short.id}-${attached ? "on" : "off"}`}
                  short={short}
                  active={cardIndex === index}
                  attached={attached}
                  muted={muted}
                  paused={paused}
                  preload={preloadFor(cardIndex, index)}
                  onTogglePause={() => setPaused((value) => !value)}
                  onSkipNext={() => {
                    clearBadClip(short.id);
                    goTo(index + 1);
                  }}
                  onFailed={cardIndex === index ? skipFailed : undefined}
                  onVideoElement={cardIndex === index ? setActiveVideo : undefined}
                  showHint={hintVisible && cardIndex === 0}
                />
              ) : (
                <PosterSlide short={short} />
              )}
            </section>
          );
        })}
      </div>

      <p className="pointer-events-none absolute top-[max(4.6rem,calc(env(safe-area-inset-top)+3.4rem))] right-4 z-30 text-right text-[11px] font-semibold tracking-wide text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {copy.counter(index + 1, items.length)}
      </p>

      <div className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-4">
        <LikeButton liked={likes.liked} count={likes.count} onToggle={likes.toggle} />
        <MuteToggle
          muted={muted}
          onToggle={() => applyMutePreference(!mutedRef.current)}
        />
        <PauseToggle paused={paused} onToggle={() => setPaused((value) => !value)} />
      </div>

      <div className="absolute top-1/2 left-3 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        <button
          type="button"
          data-testid="prev-clip"
          aria-label={copy.prevClip}
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
          className="grid size-12 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-md disabled:opacity-30"
        >
          <ChevronUp className="size-5" />
        </button>
        <button
          type="button"
          data-testid="next-clip"
          aria-label={copy.nextClip}
          disabled={index === items.length - 1}
          onClick={() => goTo(index + 1)}
          className="grid size-12 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-md disabled:opacity-30"
        >
          <ChevronDown className="size-5" />
        </button>
      </div>

      <SkipToast visible={toast} />
    </div>
  );
}

function PosterSlide({ short }: { short: BrickShort }) {
  return (
    <div className="relative h-full w-full bg-[#1a1208]" aria-hidden>
      {short.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={short.poster} alt="" className="h-full w-full object-cover" />
      ) : null}
    </div>
  );
}
