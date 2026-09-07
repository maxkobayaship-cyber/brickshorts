import { CELULAR_SHORTS } from "@/data/celular";
import { LEGO_SHORTS } from "@/data/lego";
import { TECH_SHORTS } from "@/data/tech";
import { withPlaybackMedia } from "@/lib/media";
import { uniqueByClip } from "@/lib/shuffle";
import type { BrickShort, FeedCategory } from "@/types/short";

function prepare(items: BrickShort[], compact: boolean): BrickShort[] {
  return uniqueByClip(items.map((item) => withPlaybackMedia(item, compact)));
}

export const FEEDS: Record<FeedCategory, BrickShort[]> = {
  lego: prepare(LEGO_SHORTS, false),
  celular: prepare(CELULAR_SHORTS, true),
  tech: prepare(TECH_SHORTS, true),
};

/** Post-dedupe counts. Counter UI is atual/total from the prepared feed. */
export const CATALOG_META: Record<
  FeedCategory,
  { feedItems: number; uniqueSources: number; rotated: number }
> = {
  lego: {
    feedItems: FEEDS.lego.length,
    uniqueSources: FEEDS.lego.length,
    rotated: 0,
  },
  celular: {
    feedItems: FEEDS.celular.length,
    uniqueSources: FEEDS.celular.length,
    rotated: 0,
  },
  tech: {
    feedItems: FEEDS.tech.length,
    uniqueSources: FEEDS.tech.length,
    rotated: 0,
  },
};
