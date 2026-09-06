"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { applyVideoMute, playActiveClip, silenceClip } from "@/lib/audio";
import type { BrickShort } from "@/types/short";

type VideoCardProps = {
  short: BrickShort;
  active: boolean;
  muted: boolean;
  paused: boolean;
  onTogglePause: () => void;
  onVideoElement?: (video: HTMLVideoElement | null) => void;
  showHint?: boolean;
};

export function VideoCard({
  short,
  active,
  muted,
  paused,
  onTogglePause,
  onVideoElement,
  showHint = false,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    onVideoElement?.(active ? video : null);
    return () => {
      if (active) onVideoElement?.(null);
    };
  }, [active, onVideoElement, short.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      silenceClip(video);
      return;
    }

    if (failed) return;

    if (paused) {
      applyVideoMute(video, true);
      video.pause();
      return;
    }

    playActiveClip(video, muted);
  }, [active, failed, muted, paused, short.src]);

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (moved > 12) return;
    onTogglePause();
  }

  function retry() {
    const video = videoRef.current;
    setFailed(false);
    if (!video) return;
    video.load();
    if (active && !paused) {
      playActiveClip(video, muted);
    }
  }

  return (
    <article
      className="relative h-full w-full overflow-hidden bg-black"
      data-active={active ? "true" : "false"}
      data-audio={active && !muted ? "on" : "off"}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {!failed ? (
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={short.src}
          playsInline
          loop
          muted
          preload={active ? "auto" : "metadata"}
          onCanPlay={() => {
            const video = videoRef.current;
            if (!video || !active || paused || failed) return;
            playActiveClip(video, muted);
          }}
          onError={() => setFailed(true)}
          aria-label={`Clipe de @${short.creator}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1a1208] px-8 text-center">
          <div className="space-y-2 text-white">
            <p className="font-heading text-xl font-semibold">Este clipe não carregou</p>
            <p className="text-sm text-white/70">
              A peça caiu da mesa. Tenta outra vez ou desliza para o próximo.
            </p>
          </div>
          <Button
            variant="secondary"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={retry}
            className="bg-amber-300 text-[#1a1208] hover:bg-amber-200"
          >
            <RotateCcw data-icon="inline-start" />
            Tentar de novo
          </Button>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-black/70" />

      {paused && active && !failed ? (
        <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
          Pausado
        </p>
      ) : null}

      {showHint && active ? (
        <p className="pointer-events-none absolute top-[22%] left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/90 ring-1 ring-white/10 backdrop-blur-md">
          Desliza para o próximo
        </p>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pr-20">
        <p className="font-heading text-base font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          @{short.creator}
        </p>
        <p className="mt-1 max-w-[18rem] text-sm leading-snug text-white/92 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          {short.caption}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/75">
          <span className="rounded-full bg-white/12 px-2 py-0.5 font-semibold uppercase tracking-wide ring-1 ring-white/10">
            {short.tag}
          </span>
          <span>
            {short.credit} · {short.license}
          </span>
        </div>
      </div>
    </article>
  );
}
