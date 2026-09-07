"use client";

import { useState } from "react";
import { VideoFeed } from "@/components/video-feed";
import { FEEDS } from "@/data/catalog";
import { silenceAllVideos } from "@/lib/audio";
import { writeMutedPreference } from "@/lib/session";
import type { FeedCategory } from "@/types/short";

export function HomeFeed() {
  const [category, setCategory] = useState<FeedCategory>("lego");

  return (
    <VideoFeed
      key={category}
      shorts={FEEDS[category]}
      category={category}
      onCategoryChange={(next) => {
        if (next === category) return;
        silenceAllVideos(document);
        writeMutedPreference(true);
        setCategory(next);
      }}
    />
  );
}
