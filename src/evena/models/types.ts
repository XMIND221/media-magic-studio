// Types du moteur procédural EVENA.

export type Family =
  // invitations
  | "invitation-portrait" | "invitation-editorial" | "invitation-frame" | "save-the-date" | "ceremony-frame" | "festival-poster"
  // tickets
  | "ticket-horizontal" | "ticket-mini" | "ticket-stub" | "boarding-pass"
  // badges
  | "badge-lanyard" | "badge-round" | "badge-square"
  // vip / pass
  | "pass-noir-or" | "pass-foil"
  // business
  | "business-card" | "business-vertical"
  // restaurants
  | "menu-editorial" | "menu-bistro"
  // education
  | "edu-id" | "edu-diploma"
  // religion
  | "religion-arabesque" | "religion-tabaski" | "religion-magal"
  // sport
  | "sport-ticket" | "sport-pass"
  // voyage
  | "travel-pass" | "travel-ticket"
  // commerce
  | "promo-poster" | "loyalty-card" | "gift-card" | "coupon-strip";

export interface Palette {
  id: string;
  bg: string;
  ink: string;
  gold: string;
  accent: string;
}

export interface TypoPair {
  id: string;
  display: string; // Google font display name
  body: string;
}

export interface ModelSpec {
  modelKey: string;          // ex. "evena-mkt-001:v04"
  productIndex: number;      // 1..150
  variantIndex: number;      // 0..99
  productId: string;
  productTitle: string;
  family: Family;
  palette: Palette;
  typo: TypoPair;
  layout: string;            // un des 48 layouts
  motif: string;             // un des 32 motifs
  accentHue: string;         // un des 10 accents
  designSeed: string;        // seed dérivée pour le moteur de vignette existant
}
