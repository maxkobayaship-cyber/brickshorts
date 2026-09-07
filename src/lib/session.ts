const MUTE_KEY = "maxshorts-muted";
const BAD_KEY = "maxshorts-bad";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readMutedPreference(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.sessionStorage.getItem(MUTE_KEY);
  if (raw === null) return true;
  return raw !== "0";
}

export function writeMutedPreference(muted: boolean) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

export function readBadClips(): Set<string> {
  const ids = readJson<string[]>(BAD_KEY, []);
  return new Set(ids);
}

export function markBadClip(id: string) {
  if (typeof window === "undefined") return;
  const next = readBadClips();
  next.add(id);
  window.sessionStorage.setItem(BAD_KEY, JSON.stringify([...next]));
}

export function clearBadClip(id: string) {
  if (typeof window === "undefined") return;
  const next = readBadClips();
  if (!next.delete(id)) return;
  window.sessionStorage.setItem(BAD_KEY, JSON.stringify([...next]));
}
