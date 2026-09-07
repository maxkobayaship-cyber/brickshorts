"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/copy/pt-BR";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    function onChange() {
      const node = frameRef.current;
      const fs = document.fullscreenElement === node
        || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement === node;
      setWide(fs);
    }
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  async function toggleWide() {
    const node = frameRef.current;
    if (!node) return;
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    const el = node as HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    const active = document.fullscreenElement === node
      || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement === node;

    try {
      if (active) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else doc.webkitExitFullscreen?.();
        setWide(false);
        return;
      }
      if (node.requestFullscreen) await node.requestFullscreen();
      else el.webkitRequestFullscreen?.();
      setWide(true);
    } catch {
      setWide((current) => !current);
    }
  }

  return (
    <main
      className={cn(
        "brick-workshop relative min-h-dvh w-full",
        !wide && "md:flex md:items-center md:justify-center md:px-6 md:py-5",
      )}
    >
      <button
        type="button"
        data-testid="wide-toggle"
        onClick={() => void toggleWide()}
        aria-pressed={wide}
        aria-label={wide ? copy.exitFullscreen : copy.fullscreen}
        className="absolute top-4 right-4 z-40 hidden min-h-12 items-center gap-2 rounded-full bg-black/55 px-4 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-md md:inline-flex"
      >
        {wide ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        {wide ? copy.exitFullscreen : copy.fullscreen}
      </button>
      <div
        ref={frameRef}
        className={cn(
          "phone-frame relative overflow-hidden bg-[#1a1208]",
          wide
            ? "h-dvh w-full"
            : "h-dvh w-full md:h-[min(100dvh-2.5rem,860px)] md:w-[min(100%,430px)]",
        )}
        data-wide={wide ? "true" : "false"}
      >
        {children}
      </div>
    </main>
  );
}
