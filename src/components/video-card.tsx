"use client";

import { ChevronDown, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { copy } from "@/copy/pt-BR";
import { applyVideoMute, detachClip, playActiveClip, silenceClip } from "@/lib/audio";
import type { BrickShort, ClipPhase } from "@/types/short";

const LOAD_TIMEOUT_MS = 8000;

type VideoCardProps = {
  short: BrickShort;
  active: boolean;
  attached: boolean;
  muted: boolean;
  paused: boolean;
  preload: "auto" | "metadata";
  onTogglePause: () => void;
  onSkipNext?: () => void;
  onFailed?: (id: string) => void;
  onVideoElement?: (video: HTMLVideoElement | null) => void;
  showHint?: boolean;
};

export function VideoCard({
  short,
  active,
  attached,
  muted,
  paused,
  preload,
  onTogglePause,
  onSkipNext,
  onFailed,
  onVideoElement,
  showHint = false,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const retriesRef = useRef(0);
  const failedNotified = useRef(false);
  const phaseRef = useRef<ClipPhase>(attached ? "loading" : "idle");
  const [phase, setPhase] = useState<ClipPhase>(attached ? "loading" : "idle");
  const [posterOk, setPosterOk] = useState(Boolean(short.poster));

  function assignPhase(next: ClipPhase) {
    phaseRef.current = next;
    setPhase(next);
  }

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || video.videoWidth < 2) return;
    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch {
      // Cross-origin streams may taint the canvas; keep the last good frame.
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    onVideoElement?.(active && attached ? video : null);
    return () => {
      if (active) onVideoElement?.(null);
    };
  }, [active, attached, onVideoElement, short.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!attached) {
      detachClip(video);
      return;
    }
    if (!video) return;

    if (!active) {
      captureFrame();
      silenceClip(video);
      return;
    }

    if (phaseRef.current === "error") return;

    if (paused) {
      applyVideoMute(video, true);
      video.pause();
      captureFrame();
      return;
    }

    playActiveClip(video, muted);
  }, [active, attached, muted, paused, phase, short.src]);

  useEffect(() => {
    if (!active || !attached || phase !== "loading") return;
    const timeout = window.setTimeout(() => {
      assignPhase("error");
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [active, attached, phase, short.src]);

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || phase === "error") return;
    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (moved > 12) return;
    onTogglePause();
  }

  function markReady() {
    assignPhase("playing");
    captureFrame();
  }

  function retry() {
    const video = videoRef.current;
    retriesRef.current = 0;
    failedNotified.current = false;
    assignPhase("loading");
    if (!video) return;
    video.load();
    if (active && !paused) {
      playActiveClip(video, muted);
    }
  }

  const showLoading = attached && phase === "loading";
  const poster = short.poster;

  return (
    <article
      className="relative h-full w-full overflow-hidden bg-[#1a1208]"
      data-active={active ? "true" : "false"}
      data-audio={active && !muted ? "on" : "off"}
      data-phase={phase}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {poster && posterOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          onError={() => setPosterOk(false)}
        />
      ) : null}

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {attached ? (
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={short.src}
          poster={poster}
          playsInline
          loop
          muted
          preload={preload}
          onLoadStart={() => {
            if (phaseRef.current !== "error") assignPhase("loading");
          }}
          onWaiting={() => {
            if (phaseRef.current !== "error") assignPhase("loading");
          }}
          onPlaying={() => {
            if (phaseRef.current === "error") return;
            markReady();
            const video = videoRef.current;
            if (!video || !active || paused) return;
            playActiveClip(video, muted);
          }}
          onCanPlay={() => {
            if (phaseRef.current === "error") return;
            markReady();
            const video = videoRef.current;
            if (!video || !active || paused) return;
            playActiveClip(video, muted);
          }}
          onError={() => {
            const video = videoRef.current;
            if (video && retriesRef.current < 1) {
              retriesRef.current += 1;
              video.load();
              return;
            }
            assignPhase("error");
            if (!failedNotified.current) {
              failedNotified.current = true;
              onFailed?.(short.id);
            }
          }}
          aria-label={`Clipe de @${short.creator}`}
        />
      ) : null}

      {showLoading ? (
        <div className="absolute inset-0 z-[5] flex items-center justify-center bg-black/35">
          <p className="inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {copy.loading}
          </p>
        </div>
      ) : null}

      {phase === "error" ? (
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-4 bg-[#1a1208]/80 px-8 text-center">
          <div className="space-y-2 text-white">
            <p className="font-heading text-xl font-semibold">{copy.unavailableTitle}</p>
            <p className="text-sm text-white/70">{copy.unavailableBody}</p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            {onSkipNext ? (
              <Button
                variant="secondary"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={onSkipNext}
                className="min-h-12 min-w-12 bg-amber-300 px-4 text-[#1a1208] hover:bg-amber-200"
              >
                <ChevronDown data-icon="inline-start" />
                {copy.skip}
              </Button>
            ) : null}
            <Button
              variant="outline"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={retry}
              className="min-h-12 min-w-12 border-white/25 bg-black/35 px-4 text-white hover:bg-white/10"
            >
              <RotateCcw data-icon="inline-start" />
              {copy.retry}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-black/70" />

      {paused && active && phase === "playing" ? (
        <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
          {copy.paused}
        </p>
      ) : null}

      {showHint && active && phase !== "error" ? (
        <>
          <p className="pointer-events-none absolute top-[22%] left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/90 ring-1 ring-white/10 backdrop-blur-md md:hidden">
            {copy.hintMobile}
          </p>
          <p className="pointer-events-none absolute top-[22%] left-1/2 z-10 hidden max-w-[22rem] -translate-x-1/2 rounded-full bg-black/35 px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-white/90 ring-1 ring-white/10 backdrop-blur-md md:block">
            {copy.hintDesktop}
          </p>
        </>
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
