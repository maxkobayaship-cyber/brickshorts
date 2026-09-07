export type FeedCategory = "lego" | "celular" | "tech";

export type ClipPhase = "idle" | "loading" | "playing" | "error";

export type BrickShort = {
  id: string;
  src: string;
  poster?: string;
  creator: string;
  caption: string;
  likes: number;
  tag: string;
  credit: string;
  license: string;
  sourceUrl: string;
};
