# Catalog notes

MaxShorts has three swipe feeds. Clips stream from remote CC/public URLs. This repo does **not** commit hundreds of MP4s. The on-screen counter is `atual/total` **after** unique-by `id` / normalized `src`.

## Counts

| Feed | Unique remote files | Notes |
| --- | ---: | --- |
| Tijolos (`lego`) | 200 | Commons + Archive brickfilms |
| Celular (`celular`) | 15 | Compact Commons 240p on `upload.wikimedia.org` |
| Produtos (`tech`) | 38 | Compact Commons 240p on `upload.wikimedia.org` |

Reprises were removed from Celular and Produtos. Each tab visit shuffles the unique list.

## Tijolos sources

- Wikimedia Commons videos whose titles are actually LEGO / brickfilm / Technic / Mindstorms (CC BY / BY-SA / public domain).
- Internet Archive `collection:brick_films` and extra `subject:brickfilm` items, preferring the compact `*_512kb.mp4` derivative when present.

There were more than 200 unique brickfilms; the feed uses the first 200 after Commons + Archive harvest.

## Celular sources

The first catalog used Internet Archive service dumps (`archive.org/download/…` → `*.archive.org` CDNs). Those files often return HTTP 200 but **fail in mobile browsers** (redirect + `moov` at the end + long Range stalls).

Celular now uses only **short Wikimedia Commons** clips on `upload.wikimedia.org`, rewritten to **240p VP9** transcodes (a few MB). Commons’ H.264 `360p.mpeg4.mov` derivatives are frequently larger than 3 MB (some tens of MB), so they are not used as the default `src`.

- Gigaset smartphone production (screws, mainboard, QA, label)
- Gigaset factory line (SMD, mould, conveyor)
- Phone-repairer benches, screen-protector how-to, PinePhone unbox, Terra X internals, iPhone lens 3D

Internet Archive dumps are no longer in this feed.

## Produtos sources

New-tech launches, gadget unboxings, CES/IFA-style demos, phones/laptops/wearables/consoles shown as products. Same rule as Celular: **only `upload.wikimedia.org`**, never Archive.org service dumps, compact 240p transcodes.

Public Commons footage of real product launches is scarce. After filtering, **38** unique 240p WebMs play. First clips are small and phone-friendly (Echo Dot, OnePlus launch teaser, Switch 2 turntable, ThinkPad 360, Pixel 8 unbox).

Not reused from the Celular tab (Gigaset line, phone repairer, Panzerglas, PinePhone quickstart).

## Playback

`<video src>` for Celular and Produtos points at `upload.wikimedia.org`. No YouTube API. The feed only mounts the active clip ±1 (and ±2 in the scroll direction). Outside that window the card is poster-only. Mute preference lives in `sessionStorage` (`maxshorts-muted`, default muted). Switching tabs remutes so the next feed never autoplays with sound.
