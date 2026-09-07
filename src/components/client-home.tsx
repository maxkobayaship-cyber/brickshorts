"use client";

import dynamic from "next/dynamic";
import { copy } from "@/copy/pt-BR";

const HomeFeed = dynamic(
  () => import("@/components/home-feed").then((mod) => mod.HomeFeed),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#1a1208] text-white">
        <p className="inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold ring-1 ring-white/15">
          <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {copy.loading}
        </p>
      </div>
    ),
  },
);

export function ClientHome() {
  return <HomeFeed />;
}
