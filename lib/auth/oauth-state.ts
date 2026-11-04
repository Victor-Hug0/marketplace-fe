import { timingSafeEqual } from "node:crypto";

export function oauthStateMatches(
  stored: string | undefined,
  received: string | undefined,
): boolean {
  if (!stored || !received) return false;

  const left = Buffer.from(stored);
  const right = Buffer.from(received);
  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}
