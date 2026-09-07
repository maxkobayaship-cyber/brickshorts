"use client";

import { copy } from "@/copy/pt-BR";

type SkipToastProps = {
  visible: boolean;
};

export function SkipToast({ visible }: SkipToastProps) {
  if (!visible) return null;

  return (
    <p
      role="status"
      data-testid="skip-toast"
      className="pointer-events-none absolute bottom-8 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-md"
    >
      {copy.failedSkipToast}
    </p>
  );
}
