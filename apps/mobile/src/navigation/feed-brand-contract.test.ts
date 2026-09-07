import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const tabs = readFileSync(resolve(process.cwd(), "app/(app)/(tabs)/_layout.tsx"), "utf8");

test("Home header uses the Bourbon Signal brand font and a real alert-inbox action", () => {
  assert.match(tabs, /name="index" options=\{\{ title: "Home"/);
  assert.match(tabs, /headerTitleAlign: "left"/);
  assert.match(tabs, /fontFamily: "Fraunces_700Bold"/);
  assert.match(tabs, /Bourbon Signal/);
  assert.match(tabs, /accessibilityLabel="Open alert inbox"/);
  assert.match(tabs, /name="bell-outline"/);
  assert.match(tabs, /headerTransparent: true/);
  assert.match(tabs, /headerStyle: \{ backgroundColor: "transparent" \}/);
  assert.doesNotMatch(tabs, /HomeHeaderBackground|home-shelf-header\.jpg|homeHeaderImage/);
  assert.match(tabs, /accessibilityLabel="Bourbon Signal\."/);
  assert.match(tabs, /Bourbon Signal<Text style=\{styles\.brandPeriod\}>\.<\/Text>/);
  assert.match(tabs, /brandPeriod: \{ color: colors\.accent \}/);
  assert.match(tabs, /function PostTabIcon/);
  assert.match(tabs, /postIconButton:[^\n]*width: 48[^\n]*height: 48[^\n]*backgroundColor: colors\.accent/);
  assert.match(tabs, /name="plus" size=\{28\}/);
  assert.match(tabs, /router\.push\(\{ pathname: "\/\(app\)\/\(tabs\)\/radar", params: \{ section: "matches", request: Date\.now\(\)\.toString\(\) \} \}\)/);
});
