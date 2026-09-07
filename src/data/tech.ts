import { TECH_SHORTS_A } from "@/data/tech-a";
import { TECH_SHORTS_B } from "@/data/tech-b";
import type { BrickShort } from "@/types/short";

const UNIQUE: BrickShort[] = [...TECH_SHORTS_A, ...TECH_SHORTS_B];

function fillTo(target: number): BrickShort[] {
  if (UNIQUE.length >= target) return UNIQUE.slice(0, target);
  const out = [...UNIQUE];
  let reprise = 1;
  while (out.length < target) {
    const src = UNIQUE[(out.length - UNIQUE.length) % UNIQUE.length];
    out.push({
      ...src,
      id: `${src.id}-r${reprise}`,
      caption: `${src.caption} · reprise ${reprise}`,
      likes: Math.max(900, src.likes - reprise * 21),
    });
    if ((out.length - UNIQUE.length) % UNIQUE.length === 0) {
      reprise += 1;
    }
  }
  return out;
}

export const TECH_SHORTS: BrickShort[] = fillTo(200);
export const TECH_UNIQUE_COUNT = UNIQUE.length;
