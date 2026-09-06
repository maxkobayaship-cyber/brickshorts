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
 * Play the active clip. Unmute must happen in a user-gesture stack when
 * possible; if the browser blocks unmuted autoplay, keep the picture and
 * retry unmuted after a muted start.
 */
export function playActiveClip(video: HTMLVideoElement | null, muted: boolean) {
  if (!video) return;
  applyVideoMute(video, muted);

  const attempt = video.play();
  void attempt.then(() => {
    if (!muted) {
      applyVideoMute(video, false);
    }
  }).catch(() => {
    if (muted) return;
    applyVideoMute(video, true);
    void video.play().then(() => {
      applyVideoMute(video, false);
    }).catch(() => {});
  });
}

export function silenceClip(video: HTMLVideoElement | null) {
  if (!video) return;
  applyVideoMute(video, true);
  video.pause();
}
