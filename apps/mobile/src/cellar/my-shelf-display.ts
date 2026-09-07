export interface ShelfBottleVariant {
  name: "straight" | "broad-shoulder" | "decanter" | "tall-narrow" | "rounded-shoulder" | "square-flask" | "short-wide";
  bodyWidth: number;
  bodyHeight: number;
  neckWidth: number;
  neckHeight: number;
  shoulderRadius: number;
  capWidth: number;
  labelWidth: number;
  glassColor: string;
  amberColor: string;
}

export const SHELF_BOTTLE_VARIANTS: readonly ShelfBottleVariant[] = [
  { name: "straight", bodyWidth: 24, bodyHeight: 46, neckWidth: 10, neckHeight: 16, shoulderRadius: 5, capWidth: 13, labelWidth: 17, glassColor: "#5A432A", amberColor: "#C47C24" },
  { name: "broad-shoulder", bodyWidth: 31, bodyHeight: 43, neckWidth: 9, neckHeight: 15, shoulderRadius: 11, capWidth: 14, labelWidth: 21, glassColor: "#493928", amberColor: "#A96019" },
  { name: "decanter", bodyWidth: 34, bodyHeight: 35, neckWidth: 12, neckHeight: 11, shoulderRadius: 3, capWidth: 18, labelWidth: 23, glassColor: "#64492A", amberColor: "#D18B2E" },
  { name: "tall-narrow", bodyWidth: 20, bodyHeight: 55, neckWidth: 8, neckHeight: 20, shoulderRadius: 6, capWidth: 10, labelWidth: 14, glassColor: "#423326", amberColor: "#B96A20" },
  { name: "rounded-shoulder", bodyWidth: 28, bodyHeight: 45, neckWidth: 9, neckHeight: 18, shoulderRadius: 14, capWidth: 12, labelWidth: 18, glassColor: "#5D4932", amberColor: "#D3943C" },
  { name: "square-flask", bodyWidth: 27, bodyHeight: 40, neckWidth: 12, neckHeight: 13, shoulderRadius: 1, capWidth: 15, labelWidth: 19, glassColor: "#3E3329", amberColor: "#9F5D20" },
  { name: "short-wide", bodyWidth: 33, bodyHeight: 31, neckWidth: 11, neckHeight: 10, shoulderRadius: 8, capWidth: 16, labelWidth: 22, glassColor: "#684B2C", amberColor: "#C97920" },
] as const;

export type ShelfBottleLayer = "lower" | "upper" | "shadow";

const EARLY_REVEAL_GAPS = [0, 1, 2, 1, 2, 1, 2, 3, 4, 4, 2, 2, 2, 3, 4] as const;

function revealGap(revealIndex: number) {
  if (revealIndex < EARLY_REVEAL_GAPS.length) return EARLY_REVEAL_GAPS[revealIndex]!;
  const hash = Math.imul(revealIndex + 11, 2_654_435_761) >>> 0;
  return 4 + Math.floor((revealIndex - 14) / 2) + (hash % 5);
}

function stableShelfHash(value: string) {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(hash ^ value.charCodeAt(index), 16_777_619);
  return hash >>> 0;
}

export function shelfBottleCount(ownedCount: number) {
  const safeCount = Math.max(0, Math.floor(ownedCount));
  let threshold = 1;
  let revealed = 0;
  while (threshold <= safeCount) {
    revealed += 1;
    threshold += revealGap(revealed);
  }
  return revealed;
}

export function shelfBottlePlan(ownedBottleKeys: readonly string[]) {
  const count = shelfBottleCount(ownedBottleKeys.length);
  return ownedBottleKeys.slice(0, count).map((key, index) => ({
    key,
    variant: SHELF_BOTTLE_VARIANTS[stableShelfHash(`${key}:${index}`) % SHELF_BOTTLE_VARIANTS.length]!,
    layer: (index < 6 ? "lower" : index < 14 ? "upper" : "shadow") as ShelfBottleLayer,
  }));
}

export function nextShelfPageSize(totalCount: number, currentCount: number, pageSize = 12) {
  const safeTotal = Math.max(0, Math.floor(totalCount));
  const safeCurrent = Math.max(0, Math.floor(currentCount));
  return Math.min(safeTotal, Math.max(pageSize, safeCurrent + pageSize));
}
