/** Apply mute immediately on the element (not only via React props). */
export function applyVideoMute(video: HTMLVideoElement | null, muted: boolean) {
  if (!video) return;
  video.muted = muted;
  video.defaultMuted = muted;
  if (!muted) {
    video.volume = 1;
  }
}

/**
 * Play the active clip. Unmute only when the caller already received a
 * user gesture (`muted === false`). Never retry-unmute after a muted start.
 */
export function playActiveClip(video: HTMLVideoElement | null, muted: boolean) {
  if (!video) return;
  applyVideoMute(video, muted);
  void video.play().catch(() => {
    applyVideoMute(video, true);
    void video.play().catch(() => {});
  });
}

export function silenceClip(video: HTMLVideoElement | null) {
  if (!video) return;
  applyVideoMute(video, true);
  video.pause();
}

export function silenceAllVideos(root?: ParentNode | Document | null) {
  const scope = root ?? (typeof document === "undefined" ? null : document);
  if (!scope) return;
  scope.querySelectorAll("video").forEach((video) => {
    silenceClip(video);
  });
}

export function detachClip(video: HTMLVideoElement | null) {
  if (!video) return;
  silenceClip(video);
  video.removeAttribute("src");
  try {
    video.load();
  } catch {
    // Safari can throw if the element is already tearing down.
  }
}
