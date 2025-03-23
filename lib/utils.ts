import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class SeededRNG {
  private seed: number;

  constructor(seedStr: string) {
    this.seed = this.stringHash(seedStr);
  }

  private stringHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  // This returns a number between 0 and 1
  public next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

export const generateSeededHexColor = (seedStr: string): string => {
  const rng = new SeededRNG(seedStr);
  const r = Math.floor(rng.next() * 256);
  const g = Math.floor(rng.next() * 256);
  const b = Math.floor(rng.next() * 256);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};
