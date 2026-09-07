import assert from "node:assert/strict";
import test from "node:test";
import {
  SHELF_BOTTLE_VARIANTS,
  nextShelfPageSize,
  shelfBottleCount,
  shelfBottlePlan,
} from "./my-shelf-display";

test("defines seven visibly distinct bottle silhouettes", () => {
  assert.equal(SHELF_BOTTLE_VARIANTS.length, 7);
  assert.deepEqual(SHELF_BOTTLE_VARIANTS.map((variant) => variant.name), [
    "straight",
    "broad-shoulder",
    "decanter",
    "tall-narrow",
    "rounded-shoulder",
    "square-flask",
    "short-wide",
  ]);
  const signatures = SHELF_BOTTLE_VARIANTS.map((variant) => [
    variant.bodyWidth,
    variant.bodyHeight,
    variant.neckWidth,
    variant.neckHeight,
    variant.shoulderRadius,
  ].join(":"));
  assert.equal(new Set(signatures).size, 7);
});

test("grows at irregular deterministic milestones without a finite cap", () => {
  const counts = Array.from({ length: 1_001 }, (_, owned) => shelfBottleCount(owned));
  assert.equal(counts[0], 0);
  assert.equal(counts[1], 1);
  assert.ok(counts.every((count, index) => index === 0 || count === counts[index - 1] || count === counts[index - 1]! + 1));
  assert.ok(counts.some((count, index) => index > 1 && count === counts[index - 1]), "some additions keep the next reveal mysterious");
  assert.ok(counts.some((count, index) => index > 1 && count === counts[index - 1]! + 1), "some additions reveal a surprise bottle");
  assert.ok(shelfBottleCount(500) > 12);
  assert.ok(shelfBottleCount(1_000) > shelfBottleCount(500));
});

test("uses every silhouette deterministically and adds shadow depth as the shelf fills", () => {
  const keys = Array.from({ length: 500 }, (_, index) => `bottle-${index + 1}`);
  const first = shelfBottlePlan(keys);
  const second = shelfBottlePlan(keys);
  assert.deepEqual(first, second);
  assert.equal(first.length, shelfBottleCount(keys.length));
  assert.ok(first.length > 12);
  assert.equal(new Set(first.map((entry) => entry.variant.name)).size, 7);
  assert.ok(first.some((entry) => entry.layer === "shadow"));
  assert.ok(first.some((entry) => entry.layer === "lower"));
  assert.ok(first.some((entry) => entry.layer === "upper"));
});

test("reveals collection entries in twelve-item pages", () => {
  assert.equal(nextShelfPageSize(9, 12), 9);
  assert.equal(nextShelfPageSize(40, 12), 24);
  assert.equal(nextShelfPageSize(40, 24), 36);
  assert.equal(nextShelfPageSize(40, 36), 40);
});
