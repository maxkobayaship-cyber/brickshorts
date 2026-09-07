import { normalizeSrc } from "@/lib/media";
import type { BrickShort } from "@/types/short";

/** Fisher–Yates copy so each tab visit starts on a different clip. */
export function shuffleList<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = out[i];
    const swap = out[j];
    if (current === undefined || swap === undefined) continue;
    out[i] = swap;
    out[j] = current;
  }
  return out;
}

export function uniqueByClip(items: readonly BrickShort[]): BrickShort[] {
  const seenId = new Set<string>();
  const seenSrc = new Set<string>();
  const seenCaption = new Set<string>();
  const out: BrickShort[] = [];

  for (const item of items) {
    const srcKey = normalizeSrc(item.src);
    const captionKey = `${item.creator}\n${item.caption.replace(/ · reprise \d+$/i, "")}`;
    if (seenId.has(item.id) || seenSrc.has(srcKey) || seenCaption.has(captionKey)) {
      continue;
    }
    seenId.add(item.id);
    seenSrc.add(srcKey);
    seenCaption.add(captionKey);
    out.push(item);
  }

  return out;
}
