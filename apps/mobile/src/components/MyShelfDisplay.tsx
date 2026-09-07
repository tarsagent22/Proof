import { StyleSheet, Text, View } from "react-native";
import { shelfBottlePlan, type ShelfBottleVariant } from "../cellar/my-shelf-display";
import { colors } from "../theme";

export function MyShelfDisplay({ ownedBottleKeys, ownedCount, tastedOnlyCount }: {
  ownedBottleKeys: readonly string[];
  ownedCount: number;
  tastedOnlyCount: number;
}) {
  const plan = shelfBottlePlan(ownedBottleKeys);
  const lowerShelf = plan.filter((entry) => entry.layer === "lower");
  const upperShelf = plan.filter((entry) => entry.layer === "upper");
  const shadowEntries = plan.filter((entry) => entry.layer === "shadow");
  const description = `${ownedCount} bottle${ownedCount === 1 ? "" : "s"} owned and ${tastedOnlyCount} tasted only.`;

  return (
    <View accessibilityLabel={`My Shelf. ${description}`} accessibilityRole="image" style={styles.display}>
      <View pointerEvents="none" style={styles.upperGlow} />
      <View pointerEvents="none" style={styles.lowerGlow} />
      <View pointerEvents="none" style={styles.sideShadowLeft} />
      <View pointerEvents="none" style={styles.sideShadowRight} />
      {shadowEntries.length ? <ShelfRow entries={shadowEntries} level="shadow" /> : null}
      {upperShelf.length ? <ShelfRow entries={upperShelf} level="upper" /> : null}
      <ShelfRow entries={lowerShelf} level="lower" />
      {!plan.length ? <View style={styles.empty}><Text style={styles.emptyTitle}>Your first bottle starts the shelf.</Text><Text style={styles.emptyDetail}>Owned bottles build the display over time.</Text></View> : null}
    </View>
  );
}

function ShelfRow({ entries, level }: {
  entries: ReturnType<typeof shelfBottlePlan>;
  level: "upper" | "lower" | "shadow";
}) {
  if (level === "shadow") return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.bottleRow, styles.shadowRow]}>{entries.map((entry, index) => <ShelfBottle key={entry.key} shadow stagger={index % 3} variant={entry.variant} />)}</View>;
  return <>
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.bottleRow, level === "upper" ? styles.upperRow : styles.lowerRow]}>
      {entries.map((entry) => <ShelfBottle key={entry.key} variant={entry.variant} />)}
    </View>
    <View pointerEvents="none" style={[styles.shelfEdge, level === "upper" ? styles.upperShelf : styles.lowerShelf]}>
      <View style={styles.shelfHighlight} />
    </View>
  </>;
}

function ShelfBottle({ variant, shadow = false, stagger = 0 }: { variant: ShelfBottleVariant; shadow?: boolean; stagger?: number }) {
  const totalHeight = variant.bodyHeight + variant.neckHeight + 8;
  return (
    <View style={[styles.bottleFrame, shadow && styles.shadowBottle, shadow && { marginBottom: stagger * 13 }, { width: Math.max(variant.bodyWidth, variant.capWidth) + 4, height: totalHeight }]}>
      <View style={[styles.cap, { width: variant.capWidth }]} />
      <View style={[styles.neck, { width: variant.neckWidth, height: variant.neckHeight, backgroundColor: variant.glassColor }]} />
      <View style={[
        styles.body,
        {
          width: variant.bodyWidth,
          height: variant.bodyHeight,
          borderTopLeftRadius: variant.shoulderRadius,
          borderTopRightRadius: variant.shoulderRadius,
          backgroundColor: variant.glassColor,
        },
      ]}>
        <View style={[styles.amber, { backgroundColor: variant.amberColor }]} />
        <View style={[styles.label, { width: variant.labelWidth }]}><View style={styles.labelRule} /></View>
        <View style={styles.glassGlint} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  display: {
    height: 220,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(196,148,58,0.30)",
    backgroundColor: "#15110D",
  },
  upperGlow: { position: "absolute", left: 24, right: 24, top: 23, height: 68, borderRadius: 34, backgroundColor: "rgba(196,124,36,0.10)" },
  lowerGlow: { position: "absolute", left: 16, right: 16, bottom: 15, height: 82, borderRadius: 41, backgroundColor: "rgba(214,139,43,0.13)" },
  sideShadowLeft: { position: "absolute", top: 0, bottom: 0, left: 0, width: 22, backgroundColor: "rgba(0,0,0,0.18)" },
  sideShadowRight: { position: "absolute", top: 0, bottom: 0, right: 0, width: 22, backgroundColor: "rgba(0,0,0,0.18)" },
  bottleRow: { position: "absolute", left: 18, right: 18, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 7 },
  upperRow: { bottom: 122, minHeight: 80 },
  lowerRow: { bottom: 25, minHeight: 92 },
  shadowRow: { top: 17, bottom: 28, flexWrap: "wrap-reverse", alignContent: "flex-end", opacity: 0.24, transform: [{ scale: 0.82 }] },
  bottleFrame: { alignItems: "center", justifyContent: "flex-end" },
  shadowBottle: { marginLeft: -9, opacity: 0.72 },
  cap: { height: 5, borderTopLeftRadius: 2, borderTopRightRadius: 2, backgroundColor: "#B58A47", borderColor: "rgba(255,231,187,0.35)", borderWidth: StyleSheet.hairlineWidth },
  neck: { borderLeftColor: "rgba(255,255,255,0.16)", borderLeftWidth: 1, borderRightColor: "rgba(0,0,0,0.28)", borderRightWidth: 1 },
  body: { position: "relative", overflow: "hidden", alignItems: "center", justifyContent: "center", borderColor: "rgba(214,173,107,0.44)", borderWidth: 1, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  amber: { position: "absolute", left: 1, right: 1, bottom: 1, height: "62%", opacity: 0.72, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  label: { height: 14, alignItems: "center", justifyContent: "center", borderRadius: 2, backgroundColor: "#D9C8A6", borderColor: "rgba(68,43,21,0.35)", borderWidth: StyleSheet.hairlineWidth },
  labelRule: { width: "58%", height: 2, borderRadius: 2, backgroundColor: colors.accentPressed },
  glassGlint: { position: "absolute", top: 4, left: 3, width: 2, height: "48%", borderRadius: 2, backgroundColor: "rgba(255,255,255,0.20)" },
  shelfEdge: { position: "absolute", left: 10, right: 10, height: 13, borderRadius: 3, backgroundColor: "#5A3820", borderBottomColor: "#21130C", borderBottomWidth: 5, shadowColor: "#000", shadowOpacity: 0.55, shadowRadius: 6, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  upperShelf: { bottom: 108 },
  lowerShelf: { bottom: 11 },
  shelfHighlight: { height: 2, marginHorizontal: 3, marginTop: 1, borderRadius: 2, backgroundColor: "rgba(235,174,91,0.44)" },
  empty: { position: "absolute", left: 28, right: 28, bottom: 62, alignItems: "center", gap: 5 },
  emptyTitle: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "800", textAlign: "center" },
  emptyDetail: { color: colors.muted, fontSize: 12, lineHeight: 17, textAlign: "center" },
});
