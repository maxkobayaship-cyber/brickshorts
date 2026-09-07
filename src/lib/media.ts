import type { BrickShort } from "@/types/short";

/** Strip query/hash and collapse Commons transcode suffixes for dedupe. */
export function normalizeSrc(src: string): string {
  try {
    const url = new URL(src);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return src.split("?")[0]?.split("#")[0] ?? src;
  }
}

export function uniqueKey(short: BrickShort): string {
  return `${short.id}::${normalizeSrc(short.src)}`;
}

/**
 * Prefer compact Commons 240p VP9 on upload.wikimedia.org.
 * Commons H.264 (`360p.mpeg4.mov`) is often far above 3 MB, so we keep the
 * 240p transcode that already plays on phones.
 */
export function compactCommonsSrc(src: string): string {
  if (!src.includes("upload.wikimedia.org/wikipedia/commons/")) return src;

  const lowered = src.replace(/\.360p\.vp9\.webm$/i, ".240p.vp9.webm").replace(
    /\.480p\.vp9\.webm$/i,
    ".240p.vp9.webm",
  );
  if (lowered !== src) return lowered;

  const original = src.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f]\/[0-9a-f]{2}\/)([^/]+\.(?:webm|ogv))$/i,
  );
  if (original) {
    const [, base, hashPath, file] = original;
    return `${base}transcoded/${hashPath}${file}/${file}.240p.vp9.webm`;
  }

  return src;
}

/** Static Commons video frame used as poster so the card is never empty black. */
export function commonsPoster(src: string): string | undefined {
  const transcoded = src.match(
    /\/commons\/transcoded\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+)\//i,
  );
  if (transcoded) {
    const [, a, ab, file] = transcoded;
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${file}/500px--${file}.jpg`;
  }

  const original = src.match(
    /\/commons\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+\.(?:webm|ogv|mp4))$/i,
  );
  if (original) {
    const [, a, ab, file] = original;
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${file}/500px--${file}.jpg`;
  }

  return undefined;
}

export function withPlaybackMedia(short: BrickShort, compact = true): BrickShort {
  const src = compact ? compactCommonsSrc(short.src) : short.src;
  return {
    ...short,
    src,
    poster: short.poster ?? commonsPoster(src) ?? commonsPoster(short.src),
  };
}

/** Active ±1, plus ±2 in the scroll direction. Caps mounted <video> for Safari. */
export function mountedIndexes(
  index: number,
  total: number,
  direction: -1 | 0 | 1,
): Set<number> {
  const set = new Set<number>();
  for (const candidate of [index - 1, index, index + 1]) {
    if (candidate >= 0 && candidate < total) set.add(candidate);
  }
  const extra = index + (direction === 0 ? 0 : direction * 2);
  if (extra >= 0 && extra < total) set.add(extra);
  return set;
}

export function preloadFor(cardIndex: number, index: number): "auto" | "metadata" {
  if (cardIndex > index) return "auto";
  if (cardIndex < index) return "metadata";
  return "auto";
}
