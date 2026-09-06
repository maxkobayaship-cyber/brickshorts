# Catalog notes

BrickShorts now has two swipe feeds of **200 items each**. Clips stream from remote CC/public URLs. This repo does **not** commit hundreds of MP4s.

## Counts

| Feed | Slots | Unique remote files | Rotated reprises |
| --- | ---: | ---: | ---: |
| Tijolos (`lego`) | 200 | 200 | 0 |
| Celular (`celular`) | 200 | 116 | 84 |

Reprises keep the same `src` and add `· reprise N` on the caption plus a distinct `id` (`…-r1`). The counter shows “116 únicos” on the Celular feed.

## Tijolos sources

- Wikimedia Commons videos whose titles are actually LEGO / brickfilm / Technic / Mindstorms (CC BY / BY-SA / public domain).
- Internet Archive `collection:brick_films` and extra `subject:brickfilm` items, preferring the compact `*_512kb.mp4` derivative when present.

There were more than 200 unique brickfilms; the feed uses the first 200 after Commons + Archive harvest.

## Celular sources

Public, streamable assembly / repair / teardown files — not news, ads, or game trailers:

- Samsung service disassembly set (`svc01_vids`)
- Nokia official disassembly set (`nokia-n-93-disassembly-lower-block`)
- Apple Internal iPhone repair clips (4/4S, X battery/camera/open, 7–13 / SE service videos)
- Individual IA teardowns (Note 4, Z Flip, iPhone screen/board repair)
- Commons: Gigaset smartphone production line, phone-repairer clips, screen-protector how-to

A wide Commons/Archive search for “phone” is mostly apps, news, and Foxconn politics. Honest unique hardware-assembly files in the public commons sit around **116**. The remaining 84 slots rotate those files.

## Playback

`<video src>` points at `upload.wikimedia.org` or `archive.org/download/…`. No YouTube API. The feed only mounts a ±2 window of players so 200 remote files do not all load at once.
