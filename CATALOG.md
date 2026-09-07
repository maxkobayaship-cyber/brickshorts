# Catalog notes

MaxShorts has three swipe feeds of **200 items each**. Clips stream from remote CC/public URLs. This repo does **not** commit hundreds of MP4s.

## Counts

| Feed | Slots | Unique remote files | Rotated reprises |
| --- | ---: | ---: | ---: |
| Tijolos (`lego`) | 200 | 200 | 0 |
| Celular (`celular`) | 200 | 15 | 185 |
| Produtos (`tech`) | 200 | 38 | 162 |

Reprises keep the same `src` and add `· reprise N` on the caption plus a distinct `id` (`…-r1`). The counter shows “15 únicos” / “38 únicos” when a feed rotates.

## Tijolos sources

- Wikimedia Commons videos whose titles are actually LEGO / brickfilm / Technic / Mindstorms (CC BY / BY-SA / public domain).
- Internet Archive `collection:brick_films` and extra `subject:brickfilm` items, preferring the compact `*_512kb.mp4` derivative when present.

There were more than 200 unique brickfilms; the feed uses the first 200 after Commons + Archive harvest.

## Celular sources

The first catalog used Internet Archive service dumps (`archive.org/download/…` → `*.archive.org` CDNs). Those files often return HTTP 200 but **fail in mobile browsers** (redirect + `moov` at the end + long Range stalls), so the tab opened on “Este clipe não carregou”.

Celular now uses only **short Wikimedia Commons** clips on `upload.wikimedia.org` — the same CDN that already plays the Tijolos feed:

- Gigaset smartphone production (screws, mainboard, QA, label)
- Gigaset factory line (SMD, mould, conveyor)
- Phone-repairer benches, screen-protector how-to, PinePhone unbox, Terra X internals, iPhone lens 3D

Large originals are swapped for Commons **360p/240p** transcodes (a few MB). There are **15** unique playable files; the other 185 slots are honest reprises. Internet Archive dumps are no longer in this feed.

## Produtos sources

New-tech launches, gadget unboxings, CES/IFA-style demos, phones/laptops/wearables/consoles shown as products. Same rule as Celular: **only `upload.wikimedia.org`**, never Archive.org service dumps.

Public Commons footage of real product launches is scarce (lots of game trailers, accessory SKUs, and wiki “gadgets”). After filtering and HEAD/Range checks, **38** unique 240p WebM transcodes play; the other 162 slots are honest reprises. First clips are small and phone-friendly (Echo Dot, OnePlus launch teaser, Switch 2 turntable, ThinkPad 360, Pixel 8 unbox).

Not reused from the Celular tab (Gigaset line, phone repairer, Panzerglas, PinePhone quickstart).

## Playback

`<video src>` for Celular and Produtos points at `upload.wikimedia.org`. No YouTube API. The feed only mounts a ±2 window of players so 200 remote files do not all load at once. Mute stays put when you switch tabs.
