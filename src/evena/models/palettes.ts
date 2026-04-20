import type { Palette } from "./types";

// 10 accents × ~3 palettes = 30 palettes. DA dark luxe + or.
export const ACCENT_HUES = [
  "or-classique","or-chaud","graphite","ambre","noir-pur",
  "bois-precieux","soir-profond","emeraude","saphir","grenat",
] as const;

export const PALETTES: Palette[] = [
  // or-classique
  { id: "p01", bg: "#0F0D0A", ink: "#F5EBD3", gold: "#D4AF37", accent: "#7B5A1A" },
  { id: "p02", bg: "#0E0C09", ink: "#F2E8CF", gold: "#CFA630", accent: "#6F4F14" },
  { id: "p03", bg: "#100E0B", ink: "#F8EFD8", gold: "#DCB948", accent: "#86621E" },
  // or-chaud
  { id: "p04", bg: "#120F0B", ink: "#EFE3C8", gold: "#E2C36B", accent: "#5C4514" },
  { id: "p05", bg: "#15110C", ink: "#F1DDB8", gold: "#E8C977", accent: "#7C5418" },
  { id: "p06", bg: "#1A140D", ink: "#EAD09E", gold: "#F0CE7A", accent: "#8E5E1C" },
  // graphite
  { id: "p07", bg: "#0B0E10", ink: "#E8E2CF", gold: "#C9A24A", accent: "#2A3036" },
  { id: "p08", bg: "#0D1013", ink: "#E1DAC4", gold: "#BFA055", accent: "#33393F" },
  { id: "p09", bg: "#0A0D0F", ink: "#E5DECA", gold: "#C4A152", accent: "#262C32" },
  // ambre
  { id: "p10", bg: "#16100A", ink: "#F2E1B4", gold: "#EBC76A", accent: "#8C5A1F" },
  { id: "p11", bg: "#1B130A", ink: "#F4E2A8", gold: "#EFC764", accent: "#9D6324" },
  { id: "p12", bg: "#140E08", ink: "#EFDDA6", gold: "#E2BD5C", accent: "#7E4C18" },
  // noir-pur
  { id: "p13", bg: "#0A0A0A", ink: "#F2EAD3", gold: "#D9B978", accent: "#1B1B1B" },
  { id: "p14", bg: "#070707", ink: "#EBE2C8", gold: "#D2B070", accent: "#161616" },
  { id: "p15", bg: "#0C0C0C", ink: "#F0E7CD", gold: "#DCB680", accent: "#1F1F1F" },
  // bois-precieux
  { id: "p16", bg: "#1A120B", ink: "#EAD9B0", gold: "#D2A24C", accent: "#6E3B1A" },
  { id: "p17", bg: "#1E140C", ink: "#E6D2A8", gold: "#C99A48", accent: "#7A4220" },
  { id: "p18", bg: "#160F09", ink: "#E2CFA2", gold: "#C09343", accent: "#5E3215" },
  // soir-profond
  { id: "p19", bg: "#0E0B14", ink: "#EBDFC6", gold: "#C8A45B", accent: "#3A2A4A" },
  { id: "p20", bg: "#100C18", ink: "#E7DAC0", gold: "#C29F58", accent: "#42305A" },
  { id: "p21", bg: "#0B0911", ink: "#E2D6BC", gold: "#B89A55", accent: "#322342" },
  // emeraude
  { id: "p22", bg: "#0C0E0B", ink: "#E8E0C2", gold: "#C9A862", accent: "#1F2A1F" },
  { id: "p23", bg: "#0A100B", ink: "#E2DBBE", gold: "#BFA15C", accent: "#243528" },
  { id: "p24", bg: "#0E120D", ink: "#EAE2C5", gold: "#CCA968", accent: "#1B281D" },
  // saphir
  { id: "p25", bg: "#0A0D14", ink: "#E5DEC8", gold: "#C2A457", accent: "#1F2A42" },
  { id: "p26", bg: "#080B12", ink: "#E0D9C2", gold: "#BB9F50", accent: "#192238" },
  { id: "p27", bg: "#0C1018", ink: "#E8E1CC", gold: "#C7A95C", accent: "#243150" },
  // grenat
  { id: "p28", bg: "#130A0B", ink: "#EFDFC8", gold: "#D6AE65", accent: "#4A1E22" },
  { id: "p29", bg: "#170B0C", ink: "#EBDAC2", gold: "#CFA85F", accent: "#5A2228" },
  { id: "p30", bg: "#0F0708", ink: "#E5D4BB", gold: "#C9A258", accent: "#3E191D" },
];
