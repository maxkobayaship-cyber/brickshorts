# MaxShorts

Três feeds verticais estilo Shorts: **Tijolos** (brickfilms e construções), **Celular** (montar / desmontar / reparar celular) e **Produtos** (lançamentos de gadgets, unbox e demos). Interface em português do Brasil. Sem conta e sem API do YouTube.

## Run locally

```bash
npm install && npm run dev
```

Then open [http://localhost:43127](http://localhost:43127).

Production preview (same port):

```bash
npm run build && npm run start
```

On a phone the feed is full-screen. On desktop it sits in a phone-width frame, with **Tela cheia** (Fullscreen API) in the corner.

## What you can do

- Switch **Tijolos** / **Celular** / **Produtos** in the header
- Mobile: **Arrasta pra cima**. Desktop: the same gesture chip plus `↑` `↓` / espaço / `M` (also `j` `k` and the side chevrons)
- Tap a clip or the pause control to pause/resume
- Toggle sound (`m`) — first load is always muted. Unmute is a user gesture. Switching tabs remutes so the next feed never surprise-blasts audio. Header shows **Som ligado** when unmuted.
- Like a clip — counts persist in `localStorage` on this device

## Catalogs

Feeds are **deduped** by clip `id` / normalized `src` (and caption+@). The counter is `atual/total` after that unique list. Each tab visit shuffles the start.

Celular and Produtos stream from light Wikimedia (`upload.wikimedia.org`): H.264 MP4/MOV ≤720p and ≤3 MB when Commons actually has a small transcode, otherwise 240p VP9. They never hotlink Archive.org. Bunny Stream / Cloudflare Stream can replace that later (HLS + poster) without blocking this release. Tijolos still mixes Commons + Archive brickfilms.

| Feed | Unique clips | Notes |
| --- | ---: | --- |
| Tijolos | 200 | Brickfilms + Commons LEGO clips |
| Celular | 15 | Short Commons factory/repair clips |
| Produtos | 38 | Commons unbox / launch / CES-style demos |

See [CATALOG.md](CATALOG.md) for sources.

Only the active clip and a small window (`±1`, plus `+2` in the scroll direction) mount a `<video>`. Everyone else is poster-only so Safari does not hit its ~16 player limit.

Failed clips retry `video.load()` once, then go to sessionStorage `maxshorts-bad` and auto-skip with “Clipe falhou, pulando…”. A stall of 8s shows **Clipe indisponível** with **Pular** / **Tentar de novo**.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn/ui for primitives

MaxShorts is an independent fan project. It is not affiliated with the LEGO Group and does not use official trademarks or logos.

## Deploy

Production: [https://brickshorts-web.vercel.app](https://brickshorts-web.vercel.app)  
GitHub: [https://github.com/maxkobayaship-cyber/brickshorts](https://github.com/maxkobayaship-cyber/brickshorts)

No env vars required.

## Out of scope (for now)

Accounts, uploads, YouTube API keys, comments, search, recommendations, ML, and PWA.
