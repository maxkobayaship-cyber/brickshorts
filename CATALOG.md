# Catalog notes

MaxShorts has three swipe feeds. Clips stream from remote CC/public URLs. This repo does **not** commit hundreds of MP4s. The on-screen counter is `atual/total` **after** unique-by `id` / normalized `src`.

## Counts

| Feed | Unique remote files | Notes |
| --- | ---: | --- |
| Tijolos (`lego`) | 200 | Commons + Archive brickfilms |
| Celular (`celular`) | 15 | Light Wikimedia only (no Archive.org). H.264 ≤3 MB when Commons has it, else 240p VP9 |
| Produtos (`tech`) | 38 | Same CDN rule as Celular |

Reprises were removed from Celular and Produtos. Each tab visit shuffles the unique list.

## Tijolos sources

- Wikimedia Commons videos whose titles are actually LEGO / brickfilm / Technic / Mindstorms (CC BY / BY-SA / public domain).
- Internet Archive `collection:brick_films` and extra `subject:brickfilm` items, preferring the compact `*_512kb.mp4` derivative when present.

There were more than 200 unique brickfilms; the feed uses the first 200 after Commons + Archive harvest.

## Celular sources

The first catalog used Internet Archive service dumps (`archive.org/download/…` → `*.archive.org` CDNs). Those files often return HTTP 200 but **fail in mobile browsers** (redirect + `moov` at the end + long Range stalls).

Celular now uses only **light Wikimedia Commons** on `upload.wikimedia.org` — never Archive.org dumps. Playback picks Commons **H.264 `360p.mpeg4.mov` when that file is ≤3 MB** (iOS-friendly). Everything else stays on the compact **240p VP9** transcode so we do not pull 30–100 MB MOV files.

Bunny Stream / Cloudflare Stream (HLS + poster) is the preferred long-term host. It is not wired yet: those products need account credentials, and this ticket shipped P0 without waiting on that.

- Gigaset smartphone production (screws, mainboard, QA, label)
- Gigaset factory line (SMD, mould, conveyor)
- Phone-repairer benches, screen-protector how-to, PinePhone unbox, Terra X internals, iPhone lens 3D

Internet Archive dumps are no longer in this feed.

## Produtos sources

New-tech launches, gadget unboxings, CES/IFA-style demos, phones/laptops/wearables/consoles shown as products. Same CDN rule as Celular: **only `upload.wikimedia.org`**, never Archive.org, H.264 ≤3 MB when Commons has it, otherwise 240p VP9.

Public Commons footage of real product launches is scarce. After filtering, **38** unique light Commons files play. First clips are small and phone-friendly (Echo Dot, OnePlus launch teaser, Switch 2 turntable, ThinkPad 360, Pixel 8 unbox).

Not reused from the Celular tab (Gigaset line, phone repairer, Panzerglas, PinePhone quickstart).

## Playback

`<video src>` for Celular and Produtos points at `upload.wikimedia.org`. No YouTube API. The feed only mounts the active clip ±1 (and ±2 in the scroll direction). Outside that window the card is poster-only. Mute preference lives in `sessionStorage` (`maxshorts-muted`, default muted). Switching tabs remutes so the next feed never autoplays with sound.
