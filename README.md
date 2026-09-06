# BrickShorts

Feed vertical de vídeos curtos só de construções de tijolo — speed builds, Technic, stop-motion, MOCs e exposições. Estilo Shorts/TikTok, sem conta e sem API do YouTube.

BrickShorts is a mobile-first vertical swipe feed. Open it and scroll. Each card autoplays (muted) when it is on screen.

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

- Swipe or scroll to snap between clips (arrow keys / `j` `k` on desktop; the whole page wheel-scrolls the feed)
- Tap a clip or the pause control to pause/resume (`space`)
- Toggle sound (`m` also works)
- Like a clip — counts persist in `localStorage` on this device
- Desktop also has previous/next chevrons inside the phone frame

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn/ui for primitives
- Seeded MP4s in `/public/videos` so the demo works offline of YouTube

## Seeded clips

Eight short clips, cropped to 9:16, from Wikimedia Commons (attribution required). See `src/data/shorts.ts` for captions and source URLs.

| Clip | Author | License |
| --- | --- | --- |
| Building the Lego Saturn V | Legoktm | CC BY-SA 4.0 |
| Twin-cylinder steam machine | Bernard de Go Mars | CC BY-SA 4.0 |
| Antikythera Mechanism replica | Andrew Carol | CC BY-SA 3.0 |
| Simple Walking Lego Robot | Storming Robots | CC BY-SA 3.0 |
| Projecteur LEGO, fonctionnement | Bernard de Go Mars | CC BY 4.0 |
| Cathédrale de Cologne en Lego | Gzen92 | CC BY-SA 4.0 |
| Portrait en Lego (Rosheim) | Gzen92 | CC BY-SA 4.0 |
| Lego Technic at Exhibition in Poznań 2014 | Klapi | CC BY-SA 4.0 |

BrickShorts is an independent fan project. It is not affiliated with the LEGO Group and does not use official trademarks or logos.

## Deploy

Push to GitHub and import the repo in Vercel. No env vars required for the MVP feed.

## Out of scope (for now)

Accounts, uploads, YouTube API keys, comments, search, and recommendations.
