// Fonction pure: composeModel(productIndex, variantIndex) -> ModelSpec
// 150 produits × 100 variantes = 15 000 modèles uniques.

import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { fnv1a, pickIndex } from "./hash";
import { PALETTES, ACCENT_HUES } from "./palettes";
import { TYPO_PAIRS, MOTIFS, LAYOUTS } from "./banks";
import { rangeFor } from "./catalog";
import type { ModelSpec } from "./types";

export const VARIANTS_PER_PRODUCT = 100;
export const TOTAL_MODELS = 150 * VARIANTS_PER_PRODUCT;

export function composeModel(productIndex: number, variantIndex: number): ModelSpec {
  if (productIndex < 1 || productIndex > 150) throw new Error("productIndex 1..150");
  if (variantIndex < 0 || variantIndex >= VARIANTS_PER_PRODUCT) throw new Error("variantIndex 0..99");

  const product = EVENA_MARKETPLACE_CATALOG[productIndex - 1];
  const range = rangeFor(productIndex);
  const seedBase = `${product.id}|${product.designSeed}|v${variantIndex}`;

  const family = range.families[pickIndex(seedBase, "family", range.families.length)];
  const palette = PALETTES[pickIndex(seedBase, "palette", PALETTES.length)];
  const typo = TYPO_PAIRS[pickIndex(seedBase, "typo", TYPO_PAIRS.length)];
  const layout = LAYOUTS[pickIndex(seedBase, "layout", LAYOUTS.length)];
  const motif = MOTIFS[pickIndex(seedBase, "motif", MOTIFS.length)];
  const accentHue = ACCENT_HUES[pickIndex(seedBase, "accent", ACCENT_HUES.length)];
  const designSeed = fnv1a(seedBase).toString(16).padStart(8, "0");
  const modelKey = `${product.id}:v${String(variantIndex).padStart(2, "0")}`;

  return {
    modelKey,
    productIndex,
    variantIndex,
    productId: product.id,
    productTitle: product.title,
    family,
    palette,
    typo,
    layout,
    motif,
    accentHue,
    designSeed,
  };
}

export function* iterateAllModels(): Generator<ModelSpec> {
  for (let i = 1; i <= 150; i++) {
    for (let v = 0; v < VARIANTS_PER_PRODUCT; v++) {
      yield composeModel(i, v);
    }
  }
}

/** Échantillon stratifié : N modèles répartis équitablement sur les 150 produits. */
export function stratifiedSample(count: number, variantOffset = 0): ModelSpec[] {
  const perProduct = Math.max(1, Math.round(count / 150));
  const out: ModelSpec[] = [];
  for (let i = 1; i <= 150; i++) {
    for (let k = 0; k < perProduct; k++) {
      const v = (variantOffset + k * 13 + i * 7) % VARIANTS_PER_PRODUCT;
      out.push(composeModel(i, v));
      if (out.length >= count) return out;
    }
  }
  return out;
}
