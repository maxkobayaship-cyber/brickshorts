# MaxShorts

Três feeds verticais estilo Shorts: **Tijolos** (brickfilms e construções), **Celular** (montar / desmontar / reparar telemóvel) e **Produtos** (lançamentos de gadgets, unbox e demos). Sem conta e sem API do YouTube.

## Run locally

```bash
npm install && npm run dev
```

Then open [http://localhost:43127](http://localhost:43127).

Production preview (same port):

```bash
npm run build && npm run start
```

On a phone the feed is full-screen. On desktop it sits in a phone-width frame.

## What you can do

- Switch **Tijolos** / **Celular** / **Produtos** in the header
- Swipe or scroll to snap between clips (arrow keys / `j` `k`; wheel on desktop)
- Tap a clip or the pause control to pause/resume (`space`)
- Toggle sound (`m`) — mute preference stays when you change tabs
- Like a clip — counts persist in `localStorage` on this device

## Catalogs

Each feed has **200** slots. Tijolos streams Commons + Archive brickfilms. Celular and Produtos stream only short Wikimedia Commons clips on `upload.wikimedia.org` (the CDN that already plays on phones). Hundreds of MP4s are **not** committed here.

| Feed | Items | Unique remote files | Notes |
| --- | ---: | ---: | --- |
| Tijolos | 200 | 200 | Brickfilms + Commons LEGO clips |
| Celular | 200 | 15 | Short Commons factory/repair clips; 185 honest reprises |
| Produtos | 200 | 38 | Commons unbox / launch / CES-style demos; 162 honest reprises |

See [CATALOG.md](CATALOG.md) for sources and the rotation rule.

The scroller virtualizes players: only the current clip and two neighbours mount a `<video>`.

A few cropped demo MP4s remain in `/public/videos` for offline checks. The live feeds use remote URLs in `src/data/lego.ts`, `src/data/celular.ts`, and `src/data/tech.ts`.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn/ui for primitives

MaxShorts is an independent fan project. It is not affiliated with the LEGO Group and does not use official trademarks or logos.

## Deploy

Production: [https://brickshorts-web.vercel.app](https://brickshorts-web.vercel.app)  
GitHub: [https://github.com/maxkobayaship-cyber/brickshorts](https://github.com/maxkobayaship-cyber/brickshorts)

No env vars required.

## Out of scope (for now)

Accounts, uploads, YouTube API keys, comments, search, and recommendations.
