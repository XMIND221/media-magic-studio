import type { TypoPair } from "./types";

// 20 paires typographiques (display + body)
export const TYPO_PAIRS: TypoPair[] = [
  { id: "t01", display: "Cormorant Garamond", body: "Inter" },
  { id: "t02", display: "Playfair Display",   body: "Inter" },
  { id: "t03", display: "Cinzel",              body: "Manrope" },
  { id: "t04", display: "Italiana",            body: "Inter" },
  { id: "t05", display: "Bodoni Moda",         body: "DM Sans" },
  { id: "t06", display: "Marcellus",           body: "Work Sans" },
  { id: "t07", display: "Cormorant",           body: "Manrope" },
  { id: "t08", display: "Tenor Sans",          body: "Inter" },
  { id: "t09", display: "Prata",               body: "Inter" },
  { id: "t10", display: "Cormorant Infant",    body: "DM Sans" },
  { id: "t11", display: "Forum",               body: "Inter" },
  { id: "t12", display: "Cardo",               body: "Manrope" },
  { id: "t13", display: "Spectral",            body: "Inter" },
  { id: "t14", display: "EB Garamond",         body: "Work Sans" },
  { id: "t15", display: "Libre Caslon Display", body: "Inter" },
  { id: "t16", display: "Sorts Mill Goudy",    body: "Inter" },
  { id: "t17", display: "Antic Didone",        body: "Inter" },
  { id: "t18", display: "Cormorant SC",        body: "Manrope" },
  { id: "t19", display: "Halant",              body: "Inter" },
  { id: "t20", display: "Yeseva One",          body: "Inter" },
];

// 32 motifs (noms expressifs — utilisés pour caractériser le visuel)
export const MOTIFS = [
  "kente-stripe","bogolan-grid","sahel-dot","wax-fleur","arabesque-fine","arabesque-large",
  "or-foil","or-blason","trame-fine","trame-large","art-deco-fan","art-deco-arc",
  "perforation-haute","perforation-basse","stub-droit","stub-gauche","corner-frame",
  "double-line","triple-line","ornement-coin","monogramme-or","ribbon-or","seal-emboss",
  "wave-soft","wave-strong","grain-noir","grain-or","stripes-vertical","stripes-diagonal",
  "noise-fine","constellations","geometrie-pure",
] as const;

// 48 layouts (variantes de composition)
export const LAYOUTS = [
  "centered-classic","centered-tight","centered-airy",
  "split-vertical","split-horizontal","split-asym",
  "editorial-left","editorial-right","editorial-top","editorial-bottom",
  "frame-thin","frame-bold","frame-double","frame-ornate",
  "stub-right","stub-left","stub-bottom",
  "badge-portrait","badge-landscape","badge-square",
  "header-top","header-bottom","header-side",
  "qr-bottom","qr-side","qr-corner",
  "monogram-top","monogram-bottom","monogram-corner",
  "diagonal-band","diagonal-cut","diagonal-strip",
  "perforated-top","perforated-bottom","perforated-side",
  "minimal-noir","minimal-or","minimal-mix",
  "poster-bold","poster-soft","poster-arc",
  "card-horizontal","card-vertical","card-folded",
  "ribbon-top","ribbon-side","ribbon-corner",
  "ornate-frame",
] as const;
