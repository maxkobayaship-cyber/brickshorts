import { CELULAR_SHORTS, CELULAR_UNIQUE_COUNT } from "@/data/celular";
import { LEGO_SHORTS } from "@/data/lego";
import type { BrickShort, FeedCategory } from "@/types/short";

export const FEEDS: Record<FeedCategory, BrickShort[]> = {
  lego: LEGO_SHORTS,
  celular: CELULAR_SHORTS,
};

/** Honest unique-source counts. Celular rotates short Commons clips that play on phones. */
export const CATALOG_META: Record<
  FeedCategory,
  { feedItems: number; uniqueSources: number; rotated: number }
> = {
  lego: { feedItems: LEGO_SHORTS.length, uniqueSources: 200, rotated: 0 },
  celular: {
    feedItems: CELULAR_SHORTS.length,
    uniqueSources: CELULAR_UNIQUE_COUNT,
    rotated: CELULAR_SHORTS.length - CELULAR_UNIQUE_COUNT,
  },
};
