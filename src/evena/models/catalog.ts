// Familles autorisées par plage de produits (1..150).
// Le catalogue produit (source de vérité titres) reste dans src/data/evenaMarketplaceCatalog.ts.

import type { Family } from "./types";

export interface CategoryRange {
  from: number;
  to: number;
  group: string; // libellé de la plage
  families: Family[];
}

export const CATEGORY_RANGES: CategoryRange[] = [
  { from: 1,   to: 20,  group: "Invitations",   families: ["invitation-portrait","invitation-editorial","invitation-frame","save-the-date","ceremony-frame","festival-poster"] },
  { from: 21,  to: 40,  group: "Tickets",       families: ["ticket-horizontal","ticket-mini","ticket-stub","boarding-pass"] },
  { from: 41,  to: 60,  group: "Badges",        families: ["badge-lanyard","badge-round","badge-square"] },
  { from: 61,  to: 75,  group: "VIP / Pass",    families: ["pass-noir-or","pass-foil"] },
  { from: 76,  to: 90,  group: "Business",      families: ["business-card","business-vertical"] },
  { from: 91,  to: 100, group: "Restaurants",   families: ["menu-editorial","menu-bistro","loyalty-card"] },
  { from: 101, to: 110, group: "Éducation",     families: ["edu-id","edu-diploma","badge-square"] },
  { from: 111, to: 120, group: "Religion",      families: ["religion-arabesque","religion-tabaski","religion-magal","ceremony-frame"] },
  { from: 121, to: 130, group: "Sport",         families: ["sport-ticket","sport-pass","badge-lanyard"] },
  { from: 131, to: 140, group: "Voyage",        families: ["travel-pass","travel-ticket","boarding-pass"] },
  { from: 141, to: 150, group: "Commerce/Promo",families: ["promo-poster","loyalty-card","gift-card","coupon-strip"] },
];

export function rangeFor(productIndex: number): CategoryRange {
  const r = CATEGORY_RANGES.find((x) => productIndex >= x.from && productIndex <= x.to);
  if (!r) throw new Error(`No category range for index ${productIndex}`);
  return r;
}
