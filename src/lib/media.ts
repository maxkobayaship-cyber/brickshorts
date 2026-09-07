import type { BrickShort } from "@/types/short";

/**
 * Playback CDN policy (P1 / Tecnológico):
 * - Celular + Produtos never hotlink Archive.org.
 * - Prefer Bunny Stream or Cloudflare Stream (HLS + poster) when those
 *   accounts exist. That wiring is deferred so P0 is not blocked.
 * - Short-term: light Wikimedia — H.264 ≤720p and ≤3 MB when Commons has
 *   it, otherwise the compact 240p VP9 transcode on upload.wikimedia.org.
 */

/** Commons H.264 (`360p.mpeg4.mov`) files measured at ≤3 MB. */
const LIGHT_H264_FILES = new Set([
  "Gigaset_Smartphone_Production_V_Attaching_the_Label.webm",
  "A_phone_repairer_1_VP8.webm",
  "A_phone_repairer_VP8.webm",
  "Gigaset_Cordless_Telephone_Production_V_ASM_Siplace_SMD_Production_Line.webm",
  "Gigaset_Cordless_Telephone_Production_VII_-_Pneumatic_Conveyor_Belt.webm",
  "Amazon_Echo_Dot_5th_generation_plugged_in_for_first_time_-_and_you_think_a_UFO_has_just_landed_(video).webm",
  "Short_video_presentation_of_Sony_Ericsson_W980_mobile_phone_in_switched_off_state.webm",
  "MagSafe_on_a_MacBook.ogv",
  "Andocken_der_Joy-Con_2_an_die_Nintendo_Switch_2-Konsole_20250606_C1411FIX.webm",
]);

export function isArchiveHotlink(src: string): boolean {
  return /(?:^https?:\/\/)?(?:[^/]*\.)?archive\.org\b/i.test(src);
}

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

function commonsOriginalFile(src: string): string | undefined {
  try {
    const parts = new URL(src).pathname.split("/").filter(Boolean);
    const transIdx = parts.indexOf("transcoded");
    if (transIdx >= 0) {
      const original = parts[transIdx + 3];
      return original ? decodeURIComponent(original) : undefined;
    }
    const last = parts[parts.length - 1];
    if (last && /\.(webm|ogv)$/i.test(last)) return decodeURIComponent(last);
  } catch {
    return undefined;
  }
  return undefined;
}

function commonsH264Src(src: string): string | undefined {
  if (src.endsWith(".360p.mpeg4.mov")) return src;
  if (/\.(?:240|360)p\.vp9\.webm$/i.test(src)) {
    return src.replace(/\.(?:240|360)p\.vp9\.webm$/i, ".360p.mpeg4.mov");
  }
  const original = src.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f]\/[0-9a-f]{2}\/)([^/]+\.(?:webm|ogv))$/i,
  );
  if (original) {
    const [, base, hashPath, file] = original;
    return `${base}transcoded/${hashPath}${file}/${file}.360p.mpeg4.mov`;
  }
  return undefined;
}

/**
 * Compact Celular/Produtos onto phone-friendly Wikimedia derivatives.
 * Commons H.264 is used only when the file is known to be ≤3 MB.
 */
export function compactCommonsSrc(src: string): string {
  if (!src.includes("upload.wikimedia.org/wikipedia/commons/")) return src;

  const original = commonsOriginalFile(src);
  if (original && LIGHT_H264_FILES.has(original)) {
    return commonsH264Src(src) ?? src;
  }

  const lowered = src.replace(/\.360p\.vp9\.webm$/i, ".240p.vp9.webm").replace(
    /\.480p\.vp9\.webm$/i,
    ".240p.vp9.webm",
  );
  if (lowered !== src) return lowered;

  const originalUrl = src.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f]\/[0-9a-f]{2}\/)([^/]+\.(?:webm|ogv))$/i,
  );
  if (originalUrl) {
    const [, base, hashPath, file] = originalUrl;
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
