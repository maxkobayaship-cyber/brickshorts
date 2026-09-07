import { TECH_SHORTS_A } from "@/data/tech-a";
import { TECH_SHORTS_B } from "@/data/tech-b";
import type { BrickShort } from "@/types/short";

const UNIQUE: BrickShort[] = [...TECH_SHORTS_A, ...TECH_SHORTS_B];

export const TECH_SHORTS: BrickShort[] = UNIQUE;
export const TECH_UNIQUE_COUNT = UNIQUE.length;
