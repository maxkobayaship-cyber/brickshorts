"use client";

import { useState } from "react";
import { VideoFeed } from "@/components/video-feed";
import { FEEDS } from "@/data/catalog";
import type { FeedCategory } from "@/types/short";

export function HomeFeed() {
  const [category, setCategory] = useState<FeedCategory>("lego");

  return (
    <VideoFeed
      shorts={FEEDS[category]}
      category={category}
      onCategoryChange={setCategory}
    />
  );
}
