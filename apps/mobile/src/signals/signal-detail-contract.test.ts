import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const detail = readFileSync(resolve(process.cwd(), "app/(app)/signal/[id].tsx"), "utf8");

test("Signal detail is the unified Bottle Profile route", () => {
  assert.match(detail, /Stack\.Screen options=\{\{ title: "Bottle Profile", headerBackTitle: "Home" \}\}/);
  assert.match(detail, /accessibilityLabel="Bottle Profile"/);
  assert.doesNotMatch(detail, /sectionTitle}>Bottle Profile<\/Text>/);
  assert.match(detail, />Latest Signal<\/Text>/);
  assert.match(detail, /bottleProfileState/);
  assert.match(detail, /label="Radar"/);
  assert.match(detail, /label="My Shelf"/);
  assert.match(detail, /label="Rating"/);
  assert.match(detail, /label="Inventory"/);
});

test("Bottle Profile keeps existing Signal actions and does not invent Bourbon DNA", () => {
  assert.match(detail, /Watch in Radar/);
  assert.match(detail, /Add to My Shelf/);
  assert.match(detail, /Open in Maps/);
  assert.match(detail, /Hunt Outcome/);
  assert.doesNotMatch(detail, /Bourbon DNA|DNA compatibility|compatibility score/i);
});

test("Bottle Profile removes redundant warnings and presents actions without another heading", () => {
  assert.doesNotMatch(detail, /label="Caveat"|presented\?\.caveat/);
  assert.doesNotMatch(detail, /Verify before driving/i);
  assert.doesNotMatch(detail, />Actions<\/Text>|actionsTitle/);
  assert.match(detail, /signal\.source\.type === "member" && presented\?\.summary/);
  const maps = detail.indexOf('label="Open in Maps"');
  const watch = detail.indexOf('label={saving ? "Saving…"');
  const shelf = detail.indexOf('label={inCellar ? "Already on My Shelf"');
  assert.ok(maps >= 0 && maps < watch && maps < shelf);
  assert.match(detail, /label="Open in Maps" primary/);
});
