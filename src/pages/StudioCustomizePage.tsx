import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Check, Download, Sparkles, Type, Palette, Image as ImageIcon,
  Layers, Wand2, RotateCcw, Copy, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Sun, CircleDot, Save, Share2, Upload, Trash2, Move, Star,
} from "lucide-react";
import { useBlendFavorites } from "@/hooks/use-marketplace-storage";
import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { ProductThumbnail } from "@/components/marketplace/ProductThumbnail";
import { MediaThumbnail } from "@/components/marketplace/MediaThumbnail";
import { cn } from "@/lib/utils";

const FORMATS = [
  { id: "story",      label: "Story 9:16",      ratio: "9/16"  },
  { id: "reel",       label: "Reel 9:16",       ratio: "9/16"  },
  { id: "post",       label: "Post 4:5",        ratio: "4/5"   },
  { id: "carré",      label: "Square 1:1",      ratio: "1/1"   },
  { id: "paysage",    label: "Landscape 16:9",  ratio: "16/9"  },
  { id: "portrait",   label: "Portrait 3:4",    ratio: "3/4"   },
  { id: "banner",     label: "Banner 21:9",     ratio: "21/9"  },
  { id: "ultrawide",  label: "Cinéma 2.39",     ratio: "239/100" },
  { id: "yt-thumb",   label: "YouTube 16:9",    ratio: "16/9"  },
  { id: "yt-banner",  label: "YT Banner 6.2:1", ratio: "62/10" },
  { id: "linkedin",   label: "LinkedIn 1.91:1", ratio: "191/100" },
  { id: "pinterest",  label: "Pinterest 2:3",   ratio: "2/3"   },
  { id: "a4",         label: "Print A4",        ratio: "210/297" },
  { id: "ticket",     label: "Ticket 5:2",      ratio: "5/2"   },
  { id: "card",       label: "Card 85:55",      ratio: "85/55" },
  { id: "vertical",   label: "Vertical 2:5",    ratio: "2/5"   },
];

// 24 palettes — couleurs, dégradés, mesh, motifs, textures (pas que des couleurs)
const PALETTES = [
  // Color gradients
  { id: "gold",     label: "Luxury Gold",     kind: "gradient", from: "hsl(43 80% 55%)",  to: "hsl(38 65% 38%)" },
  { id: "noir",     label: "Pure Noir",       kind: "gradient", from: "hsl(30 14% 9%)",   to: "hsl(30 14% 4%)"  },
  { id: "neon",     label: "Neon Pop",        kind: "gradient", from: "hsl(310 100% 60%)",to: "hsl(190 100% 55%)" },
  { id: "ocean",    label: "Cinematic Blue",  kind: "gradient", from: "hsl(220 70% 35%)", to: "hsl(260 60% 25%)" },
  { id: "fire",     label: "Sunset Fire",     kind: "gradient", from: "hsl(20 90% 55%)",  to: "hsl(0 80% 40%)"   },
  { id: "mint",     label: "Editorial Mint",  kind: "gradient", from: "hsl(160 50% 45%)", to: "hsl(180 40% 20%)" },
  { id: "ivory",    label: "Ivory Editorial", kind: "gradient", from: "hsl(40 30% 92%)",  to: "hsl(35 20% 78%)"  },
  { id: "berry",    label: "Berry Velvet",    kind: "gradient", from: "hsl(330 60% 35%)", to: "hsl(290 50% 18%)" },
  { id: "forest",   label: "Forest Deep",     kind: "gradient", from: "hsl(150 40% 22%)", to: "hsl(120 30% 8%)"  },
  { id: "rose",     label: "Rose Champagne",  kind: "gradient", from: "hsl(15 60% 75%)",  to: "hsl(340 40% 50%)" },
  { id: "midnight", label: "Midnight Indigo", kind: "gradient", from: "hsl(245 60% 25%)", to: "hsl(260 55% 8%)"  },
  { id: "copper",   label: "Copper Patina",   kind: "gradient", from: "hsl(18 60% 45%)",  to: "hsl(170 30% 25%)" },
  // Mesh / radial
  { id: "mesh-aurora",  label: "Mesh Aurora",   kind: "mesh",
    css: "radial-gradient(60% 60% at 20% 20%, hsl(280 80% 55% / .9), transparent 60%), radial-gradient(60% 60% at 80% 80%, hsl(190 90% 55% / .8), transparent 60%), linear-gradient(135deg,#0a0612,#1a0b2e)" },
  { id: "mesh-sunset",  label: "Mesh Sunset",   kind: "mesh",
    css: "radial-gradient(60% 60% at 30% 70%, hsl(0 90% 60% / .85), transparent 60%), radial-gradient(60% 60% at 70% 30%, hsl(35 95% 60% / .75), transparent 60%), linear-gradient(180deg,#1a0908,#0a0306)" },
  { id: "mesh-mint",    label: "Mesh Mint",     kind: "mesh",
    css: "radial-gradient(60% 60% at 25% 30%, hsl(160 70% 55% / .85), transparent 60%), radial-gradient(60% 60% at 75% 75%, hsl(200 70% 55% / .7), transparent 60%), linear-gradient(135deg,#04130f,#020807)" },
  { id: "mesh-rose",    label: "Mesh Rose",     kind: "mesh",
    css: "radial-gradient(60% 60% at 30% 30%, hsl(330 80% 65% / .8), transparent 60%), radial-gradient(60% 60% at 80% 70%, hsl(280 70% 55% / .7), transparent 60%), linear-gradient(135deg,#180616,#08020a)" },
  // Textures / motifs (non-colored or pattern-based)
  { id: "tex-paper",    label: "Paper Ivory",   kind: "texture",
    css: "repeating-linear-gradient(45deg, hsl(40 20% 90%) 0 2px, hsl(40 18% 86%) 2px 4px), linear-gradient(180deg,#efe7d4,#dccbb0)" },
  { id: "tex-marble",   label: "Marbre Noir",   kind: "texture",
    css: "radial-gradient(80% 60% at 30% 20%, hsl(0 0% 18% / .8), transparent 60%), radial-gradient(60% 50% at 70% 80%, hsl(0 0% 25% / .7), transparent 60%), linear-gradient(135deg,#0a0a0a,#1a1a1a)" },
  { id: "tex-marble-w", label: "Marbre Blanc",  kind: "texture",
    css: "radial-gradient(80% 60% at 30% 20%, hsl(40 10% 92% / .9), transparent 60%), radial-gradient(60% 50% at 70% 80%, hsl(40 5% 80% / .7), transparent 60%), linear-gradient(135deg,#f0ece4,#d8d2c4)" },
  { id: "tex-grid",     label: "Grille Or",     kind: "texture",
    css: "linear-gradient(hsl(43 70% 55% / .12) 1px,transparent 1px), linear-gradient(90deg,hsl(43 70% 55% / .12) 1px,transparent 1px), linear-gradient(135deg,#0c0a06,#050403) 0 0/100% 100%, #0a0805" },
  { id: "tex-stripes",  label: "Rayures",       kind: "texture",
    css: "repeating-linear-gradient(135deg, hsl(0 0% 8%) 0 18px, hsl(0 0% 12%) 18px 36px)" },
  { id: "tex-noise",    label: "Grain Noir",    kind: "texture",
    css: "radial-gradient(circle at 1px 1px,hsl(0 0% 100% / .06) 1px,transparent 0) 0 0/3px 3px, linear-gradient(135deg,#0a0a0a,#050505)" },
  { id: "tex-velvet",   label: "Velours",       kind: "texture",
    css: "radial-gradient(120% 90% at 50% 50%, hsl(280 30% 25%), hsl(280 40% 8%))" },
  { id: "tex-sand",     label: "Sable Doré",    kind: "texture",
    css: "radial-gradient(circle at 30% 30%, hsl(35 50% 75% / .9), transparent 60%), linear-gradient(180deg,#3d2c14,#1a1106)" },
];

// 16 accents
const ACCENTS = [
  { id: "gold",      color: "hsl(43 80% 55%)",  label: "Gold"     },
  { id: "white",     color: "hsl(0 0% 100%)",   label: "Ivory"    },
  { id: "rose",      color: "hsl(340 90% 65%)", label: "Rose"     },
  { id: "cyan",      color: "hsl(190 90% 60%)", label: "Cyan"     },
  { id: "lime",      color: "hsl(80 75% 60%)",  label: "Lime"     },
  { id: "coral",     color: "hsl(15 85% 60%)",  label: "Coral"    },
  { id: "violet",    color: "hsl(270 80% 65%)", label: "Violet"   },
  { id: "magenta",   color: "hsl(310 90% 60%)", label: "Magenta"  },
  { id: "emerald",   color: "hsl(150 70% 50%)", label: "Emerald"  },
  { id: "amber",     color: "hsl(35 95% 55%)",  label: "Amber"    },
  { id: "sky",       color: "hsl(210 90% 60%)", label: "Sky"      },
  { id: "ruby",      color: "hsl(0 75% 55%)",   label: "Ruby"     },
  { id: "pearl",     color: "hsl(40 20% 88%)",  label: "Pearl"    },
  { id: "graphite",  color: "hsl(220 8% 35%)",  label: "Graphite" },
  { id: "champagne", color: "hsl(38 50% 75%)",  label: "Champagne"},
  { id: "obsidian",  color: "hsl(240 10% 12%)", label: "Obsidian" },
];

// 14 typographies
const FONT_PAIRS = [
  { id: "luxe",     label: "Cormorant Garamond",   display: '"Cormorant Garamond", serif' },
  { id: "playfair", label: "Playfair Display",     display: '"Playfair Display", Georgia, serif' },
  { id: "bodoni",   label: "Bodoni Moda",          display: '"Bodoni Moda", "Didot", serif' },
  { id: "didot",    label: "Didot Editorial",      display: '"Didot", "Bodoni Moda", serif' },
  { id: "cinzel",   label: "Cinzel Roman",         display: '"Cinzel", "Trajan Pro", serif' },
  { id: "marcell",  label: "Marcellus Classic",    display: '"Marcellus", serif' },
  { id: "italiana", label: "Italiana Couture",     display: '"Italiana", serif' },
  { id: "fraunces", label: "Fraunces Modern",      display: '"Fraunces", serif' },
  { id: "edit",     label: "Georgia Editorial",    display: 'Georgia, "Times New Roman", serif' },
  { id: "inter",    label: "Inter Sans",           display: '"Inter", system-ui, sans-serif' },
  { id: "manrope",  label: "Manrope Modern",       display: '"Manrope", sans-serif' },
  { id: "space",    label: "Space Grotesk",        display: '"Space Grotesk", sans-serif' },
  { id: "mono",     label: "JetBrains Mono",       display: '"JetBrains Mono", "Courier New", monospace' },
  { id: "syne",     label: "Syne Display",         display: '"Syne", sans-serif' },
];

// 18 overlays / textures
const OVERLAYS = [
  { id: "none",       label: "Aucun" },
  { id: "grain",      label: "Grain" },
  { id: "scan",       label: "Scanlines" },
  { id: "leak",       label: "Light leak" },
  { id: "vignette",   label: "Vignette" },
  { id: "grid",       label: "Grille Or" },
  { id: "shimmer",    label: "Or Shimmer" },
  { id: "vinyl",      label: "Vinyle" },
  { id: "spotlight",  label: "Spotlight" },
  { id: "orbs",       label: "Orbes" },
  { id: "neon",       label: "Néon" },
  { id: "halftone",   label: "Halftone" },
  { id: "stripes",    label: "Rayures" },
  { id: "diagonal",   label: "Diagonale" },
  { id: "crt",        label: "CRT TV" },
  { id: "dust",       label: "Poussière" },
  { id: "bokeh",      label: "Bokeh" },
  { id: "duotone",    label: "Duotone" },
];

// 12 variantes — différences MARQUÉES (layout, contraste, échelle, overlay, blend)
// v11 & v12 = "spécial inédit" (effets rares, layouts audacieux)
const VARIANTS = ["v1","v2","v3","v4","v5","v6","v7","v8","v9","v10","v11","v12"] as const;
type VariantId = typeof VARIANTS[number];

interface VariantProfile {
  label: string;
  // visual transforms applied to the template visual layer
  rotate: number;          // deg
  scale: number;           // 0.85..1.25
  translateX: number;      // %
  translateY: number;      // %
  // tone overrides (multipliers applied on top of user values)
  brightnessMul: number;
  contrastMul: number;
  saturationMul: number;
  // text layout overrides
  align: "left" | "center" | "right";
  justify: "start" | "center" | "end";
  padding: number;         // px
  titleSizeMul: number;    // multiplier
  uppercase: boolean | null;   // null = keep user
  // visual flair
  overlayHint: string | null;  // overrides overlay if set
  blendOverlay: "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "color-dodge" | "difference";
  // background tint
  tintHueShift: number;    // deg (rotates background hue via filter)
  flip: boolean;
}

const VARIANT_PROFILES: Record<VariantId, VariantProfile> = {
  v1:  { label: "Classique",   rotate: 0,    scale: 1.00, translateX: 0,  translateY: 0,  brightnessMul: 1.00, contrastMul: 1.00, saturationMul: 1.00, align: "left",   justify: "end",    padding: 20, titleSizeMul: 1.00, uppercase: null,  overlayHint: null,        blendOverlay: "normal",      tintHueShift: 0,    flip: false },
  v2:  { label: "Centré airy", rotate: 0,    scale: 0.92, translateX: 0,  translateY: 0,  brightnessMul: 1.10, contrastMul: 0.92, saturationMul: 0.85, align: "center", justify: "center", padding: 32, titleSizeMul: 1.15, uppercase: false, overlayHint: "vignette",  blendOverlay: "soft-light",  tintHueShift: 0,    flip: false },
  v3:  { label: "Editorial",   rotate: 0,    scale: 1.00, translateX: 0,  translateY: 0,  brightnessMul: 0.85, contrastMul: 1.25, saturationMul: 0.65, align: "left",   justify: "start",  padding: 24, titleSizeMul: 0.95, uppercase: true,  overlayHint: "grain",     blendOverlay: "normal",      tintHueShift: 0,    flip: false },
  v4:  { label: "Cinéma",      rotate: 0,    scale: 1.10, translateX: 0,  translateY: 5,  brightnessMul: 0.75, contrastMul: 1.35, saturationMul: 1.10, align: "center", justify: "end",    padding: 28, titleSizeMul: 1.30, uppercase: true,  overlayHint: "leak",      blendOverlay: "screen",      tintHueShift: -10,  flip: false },
  v5:  { label: "Néon Pop",    rotate: 0,    scale: 1.00, translateX: 0,  translateY: 0,  brightnessMul: 1.15, contrastMul: 1.20, saturationMul: 1.80, align: "center", justify: "center", padding: 18, titleSizeMul: 1.10, uppercase: true,  overlayHint: "neon",      blendOverlay: "color-dodge", tintHueShift: 35,   flip: false },
  v6:  { label: "Asymétrique", rotate: -3,   scale: 1.05, translateX: -4, translateY: -2, brightnessMul: 1.00, contrastMul: 1.10, saturationMul: 1.00, align: "right",  justify: "start",  padding: 22, titleSizeMul: 1.05, uppercase: false, overlayHint: "diagonal",  blendOverlay: "overlay",     tintHueShift: 0,    flip: false },
  v7:  { label: "Mono noir",   rotate: 0,    scale: 1.00, translateX: 0,  translateY: 0,  brightnessMul: 0.80, contrastMul: 1.40, saturationMul: 0.00, align: "left",   justify: "end",    padding: 20, titleSizeMul: 1.00, uppercase: true,  overlayHint: "grain",     blendOverlay: "multiply",    tintHueShift: 0,    flip: false },
  v8:  { label: "Glow doré",   rotate: 0,    scale: 1.00, translateX: 0,  translateY: 0,  brightnessMul: 1.05, contrastMul: 1.05, saturationMul: 1.20, align: "center", justify: "center", padding: 24, titleSizeMul: 1.20, uppercase: false, overlayHint: "shimmer",   blendOverlay: "screen",      tintHueShift: 15,   flip: false },
  v9:  { label: "Halftone",    rotate: 0,    scale: 1.00, translateX: 0,  translateY: 0,  brightnessMul: 0.95, contrastMul: 1.50, saturationMul: 0.40, align: "left",   justify: "start",  padding: 16, titleSizeMul: 0.90, uppercase: true,  overlayHint: "halftone",  blendOverlay: "multiply",    tintHueShift: 0,    flip: false },
  v10: { label: "Mirroir",     rotate: 0,    scale: 1.08, translateX: 0,  translateY: 0,  brightnessMul: 1.00, contrastMul: 1.15, saturationMul: 1.10, align: "right",  justify: "end",    padding: 26, titleSizeMul: 1.10, uppercase: false, overlayHint: "spotlight", blendOverlay: "overlay",     tintHueShift: 0,    flip: true  },
  // ── Spécial inédit ──
  v11: { label: "✦ Risograph", rotate: -1,   scale: 1.04, translateX: 2,  translateY: -3, brightnessMul: 1.10, contrastMul: 1.45, saturationMul: 1.60, align: "left",   justify: "end",    padding: 22, titleSizeMul: 1.05, uppercase: true,  overlayHint: "halftone",  blendOverlay: "difference",  tintHueShift: 60,   flip: false },
  v12: { label: "✦ Aurora",    rotate: 0,    scale: 1.15, translateX: 0,  translateY: 0,  brightnessMul: 0.90, contrastMul: 1.30, saturationMul: 1.40, align: "center", justify: "center", padding: 36, titleSizeMul: 1.45, uppercase: false, overlayHint: "bokeh",     blendOverlay: "color-dodge", tintHueShift: -45,  flip: false },
};

interface State {
  title: string;
  subtitle: string;
  badge: string;
  format: string;
  palette: string;
  accent: string;
  font: string;
  variantSeed: string;
  overlay: string;
  // Layers visibility
  showBackground: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  showBadge: boolean;
  showLogo: boolean;
  // Text styling
  titleSize: number;     // 12-72
  titleWeight: number;   // 300/400/500/600/700
  titleAlign: "left" | "center" | "right";
  titleItalic: boolean;
  titleUppercase: boolean;
  // Effects
  brightness: number;    // 50-150
  contrast: number;      // 50-150
  saturation: number;    // 0-200
  blur: number;          // 0-12
  shadow: boolean;
  rounded: number;       // 0-32
  paletteOpacity: number;// 0-100
  // User image (background photo)
  userImage: string | null;     // dataURL
  imageMode: "cover" | "contain" | "fill";
  imageScale: number;           // 50-300 (%)
  imageX: number;               // -100..100 (%)
  imageY: number;               // -100..100 (%)
  imageRotate: number;          // -180..180 (deg)
  imageOpacity: number;         // 0-100
  imageBlend: "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "luminosity" | "color" | "darken" | "lighten" | "difference";
  // User logo (small overlay image)
  userLogo: string | null;
  logoSize: number;             // 24-160 (px)
  logoOpacity: number;          // 0-100
  logoCorner: "tl" | "tr" | "bl" | "br";
  logoBlend: "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "luminosity" | "color-dodge" | "difference" | "exclusion" | "hue" | "saturation" | "lighten";
  // Text positioning offset
  textX: number;          // -50..50 (%)
  textY: number;          // -50..50 (%)
  // Overlay impact
  overlayIntensity: number; // 0-200 (%)
}

type Action =
  | { type: "set"; patch: Partial<State> }
  | { type: "reset"; initial: State }
  | { type: "toggle"; key: keyof State };

function reducer(state: State, action: Action): State {
  if (action.type === "set") return { ...state, ...action.patch };
  if (action.type === "reset") return action.initial;
  if (action.type === "toggle") return { ...state, [action.key]: !(state as any)[action.key] };
  return state;
}

export default function StudioCustomizePage() {
  const { id } = useParams<{ id: string }>();
  const product = EVENA_MARKETPLACE_CATALOG.find((p) => p.id === id);

  const initial: State = useMemo(() => ({
    title: product?.title ?? "Your Title",
    subtitle: "EVENA · Premium",
    badge: product?.premium ? "PREMIUM" : "NEW",
    format: product?.supportedFormats?.[0] ?? "story",
    palette: PALETTES[0].id,
    accent: ACCENTS[0].id,
    font: FONT_PAIRS[0].id,
    variantSeed: "v1",
    overlay: "none",
    showBackground: true,
    showTitle: true,
    showSubtitle: true,
    showBadge: true,
    showLogo: true,
    titleSize: 28,
    titleWeight: 600,
    titleAlign: "left",
    titleItalic: false,
    titleUppercase: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    shadow: true,
    rounded: 16,
    paletteOpacity: 100,
    userImage: null,
    imageMode: "cover",
    imageScale: 100,
    imageX: 0,
    imageY: 0,
    imageRotate: 0,
    imageOpacity: 100,
    imageBlend: "normal",
    userLogo: null,
    logoSize: 56,
    logoOpacity: 100,
    logoCorner: "tl",
    logoBlend: "normal",
    textX: 0,
    textY: 0,
    overlayIntensity: 100,
  }), [product]);

  const [state, dispatch] = useReducer(reducer, initial);
  const [tab, setTab] = useState<"design" | "text" | "layers" | "effects">("design");

  useEffect(() => {
    if (product) document.title = `Studio · ${product.title} — EVENA`;
  }, [product]);

  // Re-init when navigating to a different product
  useEffect(() => { dispatch({ type: "reset", initial }); }, [initial]);

  const activePalette = useMemo(() => PALETTES.find(p => p.id === state.palette)!, [state.palette]);
  const activeAccent  = useMemo(() => ACCENTS.find(a => a.id === state.accent)!, [state.accent]);
  const activeFont    = useMemo(() => FONT_PAIRS.find(f => f.id === state.font)!, [state.font]);
  const activeFormat  = useMemo(() => FORMATS.find(f => f.id === state.format) ?? FORMATS[0], [state.format]);

  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-center">
          <p className="font-display text-2xl text-foreground">Template introuvable</p>
          <Link to="/marketplace" className="mt-3 inline-block text-sm text-gold hover:underline">
            ← Retour à la marketplace
          </Link>
        </div>
      </div>
    );
  }

  const isMedia = product.category === "media";
  const set = (patch: Partial<State>) => dispatch({ type: "set", patch });

  const profile = VARIANT_PROFILES[state.variantSeed as VariantId] ?? VARIANT_PROFILES.v1;
  // Effective values combining user state + variant profile
  const effBrightness = Math.round(state.brightness * profile.brightnessMul);
  const effContrast   = Math.round(state.contrast   * profile.contrastMul);
  const effSaturation = Math.round(state.saturation * profile.saturationMul);
  const effOverlay    = profile.overlayHint && state.overlay === "none" ? profile.overlayHint : state.overlay;
  const effAlign      = profile.align;
  const effJustify    = profile.justify;
  const effPadding    = profile.padding;
  const effTitleSize  = Math.round(state.titleSize * profile.titleSizeMul);
  const effUppercase  = profile.uppercase ?? state.titleUppercase;
  const filterCss     = `brightness(${effBrightness}%) contrast(${effContrast}%) saturate(${effSaturation}%) blur(${state.blur}px) hue-rotate(${profile.tintHueShift}deg)`;
  // Variant seed for thumbnail engines: ONLY variant — never font/accent (font shouldn't change colors)
  const thumbSeed = `${state.variantSeed}-${state.variantSeed.repeat(3)}-${state.palette}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <Link
            to={`/marketplace/${product.id}`}
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <p className="hidden text-[10px] uppercase tracking-[0.4em] text-gold sm:block">EVENA STUDIO</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "reset", initial })}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/80 transition-luxe hover:border-gold/50 hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Réinitialiser
            </button>
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/5 px-3 py-1.5 text-xs text-gold transition-luxe hover:bg-gold/10"
            >
              <Save className="h-3 w-3" /> Sauvegarder
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-xs font-semibold tracking-wide text-[hsl(var(--ink))] shadow-glow transition-luxe hover:scale-[1.02]"
            >
              <Download className="h-3.5 w-3.5" /> Exporter
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[1fr_400px]">
        {/* Preview */}
        <section className="order-1 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
          <div className="rounded-3xl border border-border/60 bg-gradient-noir p-4 sm:p-8">
            <div className="mx-auto" style={{ maxWidth: ["banner","paysage","ultrawide","yt-banner","linkedin","ticket"].includes(state.format) ? 640 : 380 }}>
              <div
                key={`${state.format}-${state.palette}-${state.variantSeed}`}
                className={cn(
                  "relative overflow-hidden border border-border/60 animate-fade-up",
                  state.shadow ? "shadow-luxe" : "shadow-none"
                )}
                style={{
                  aspectRatio: activeFormat.ratio,
                  borderRadius: state.rounded,
                  background: state.showBackground
                    ? (activePalette.kind === "gradient" || !activePalette.kind
                        ? `linear-gradient(135deg, ${activePalette.from}, ${activePalette.to})`
                        : activePalette.css)
                    : "transparent",
                }}
              >
                {/* Template visual — variant-driven transforms (scale/rotate/translate/flip + blend) */}
                <div
                  className="absolute inset-0"
                  style={{
                    filter: filterCss,
                    opacity: state.paletteOpacity / 100,
                    transform: `${profile.flip ? "scaleX(-1) " : ""}translate(${profile.translateX}%, ${profile.translateY}%) scale(${profile.scale}) rotate(${profile.rotate}deg)`,
                    transformOrigin: "center",
                    mixBlendMode: profile.blendOverlay,
                  }}
                >
                  {state.showBackground && (
                    isMedia
                      ? <MediaThumbnail product={{ ...product, title: state.title }} variantSeed={thumbSeed} />
                      : <ProductThumbnail product={{ ...product, title: state.title }} variantSeed={thumbSeed} />
                  )}
                </div>

                {/* User-uploaded background image — drag to move, sits above template, below overlays + text */}
                {state.userImage && (
                  <DraggableImageLayer
                    src={state.userImage}
                    mode={state.imageMode}
                    scale={state.imageScale}
                    x={state.imageX}
                    y={state.imageY}
                    rotate={state.imageRotate}
                    opacity={state.imageOpacity}
                    blend={state.imageBlend}
                    onMove={(x, y) => set({ imageX: x, imageY: y })}
                  />
                )}

                {/* User logo overlay — supports blend modes + preserves aspect ratio */}
                {state.userLogo && (
                  <img
                    src={state.userLogo}
                    alt="Logo utilisateur"
                    className={cn(
                      "pointer-events-none absolute z-30 select-none object-contain",
                      state.logoCorner === "tl" && "left-3 top-3",
                      state.logoCorner === "tr" && "right-3 top-3",
                      state.logoCorner === "bl" && "left-3 bottom-3",
                      state.logoCorner === "br" && "right-3 bottom-3",
                    )}
                    style={{
                      width: state.logoSize,
                      height: "auto",
                      maxHeight: state.logoSize,
                      opacity: state.logoOpacity / 100,
                      mixBlendMode: state.logoBlend,
                    }}
                    draggable={false}
                  />
                )}

                {/* Overlay (variant can force one when user has none) — intensity boosted */}
                {effOverlay !== "none" && (
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 z-20",
                      effOverlay === "grain"     && "mt-noise",
                      effOverlay === "scan"      && "mt-scanlines",
                      effOverlay === "leak"      && "mt-light-leak",
                      effOverlay === "vignette"  && "mt-vignette",
                      effOverlay === "grid"      && "mt-grid-soft",
                      effOverlay === "shimmer"   && "mt-gold-shimmer",
                      effOverlay === "vinyl"     && "mt-vinyl",
                      effOverlay === "spotlight" && "mt-spotlight",
                      effOverlay === "orbs"      && "mt-orbs",
                      effOverlay === "neon"      && "mt-neon-bg",
                    )}
                    style={{
                      opacity: state.overlayIntensity / 100,
                      mixBlendMode:
                        effOverlay === "duotone" ? "color"
                        : effOverlay === "shimmer" || effOverlay === "leak" || effOverlay === "neon" || effOverlay === "spotlight" ? "screen"
                        : effOverlay === "halftone" || effOverlay === "crt" || effOverlay === "vignette" ? "multiply"
                        : "normal",
                      ...(effOverlay === "halftone"
                        ? { backgroundImage: "radial-gradient(hsl(0 0% 0% / .9) 1.6px, transparent 1.8px)", backgroundSize: "5px 5px" }
                        : effOverlay === "stripes"
                        ? { backgroundImage: "repeating-linear-gradient(90deg, hsl(0 0% 0% / .55) 0 6px, transparent 6px 12px)" }
                        : effOverlay === "diagonal"
                        ? { backgroundImage: "repeating-linear-gradient(45deg, hsl(43 80% 55% / .35) 0 8px, transparent 8px 18px)" }
                        : effOverlay === "crt"
                        ? { backgroundImage: "repeating-linear-gradient(0deg, hsl(0 0% 0% / .45) 0 2px, transparent 2px 4px), radial-gradient(120% 80% at 50% 50%, transparent 55%, hsl(0 0% 0% / .8))" }
                        : effOverlay === "dust"
                        ? { backgroundImage: "radial-gradient(circle at 20% 30%, hsl(0 0% 100% / .35) 1px, transparent 2px), radial-gradient(circle at 70% 80%, hsl(0 0% 100% / .3) 1px, transparent 2px), radial-gradient(circle at 40% 70%, hsl(0 0% 100% / .25) 1px, transparent 2px)", backgroundSize: "120px 120px, 90px 90px, 150px 150px" }
                        : effOverlay === "bokeh"
                        ? { backgroundImage: "radial-gradient(circle at 20% 30%, hsl(43 80% 60% / .7) 0, transparent 18px), radial-gradient(circle at 70% 60%, hsl(310 70% 60% / .65) 0, transparent 22px), radial-gradient(circle at 50% 80%, hsl(190 80% 60% / .65) 0, transparent 26px)" }
                        : effOverlay === "duotone"
                        ? { background: "linear-gradient(135deg, hsl(43 80% 55% / .65), hsl(280 70% 50% / .65))" }
                        : {}),
                    }}
                  />
                )}

                {/* Custom text layer (variant overrides align/justify/padding/title size + user X/Y offset) */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 z-40 flex flex-col",
                    effJustify === "start"  && "justify-start",
                    effJustify === "center" && "justify-center",
                    effJustify === "end"    && "justify-end",
                  )}
                  style={{
                    textAlign: effAlign,
                    padding: effPadding,
                    transform: `translate(${state.textX}%, ${state.textY}%)`,
                  }}
                >
                  {state.showLogo && (
                    <div
                      className={cn(
                        "mb-auto inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold tracking-[0.3em]",
                        effAlign === "center" && "mx-auto",
                        effAlign === "right" && "ml-auto",
                      )}
                      style={{ background: "hsl(0 0% 0% / 0.35)", color: activeAccent.color, backdropFilter: "blur(8px)" }}
                    >
                      <span
                        className="grid h-4 w-4 place-items-center rounded-sm font-display text-[10px]"
                        style={{ background: activeAccent.color, color: "hsl(var(--ink))" }}
                      >E</span>
                      EVENA
                    </div>
                  )}
                  {state.showBadge && state.badge && (
                    <span
                      className={cn(
                        "mb-2 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                        effAlign === "center" && "mx-auto",
                        effAlign === "right" && "ml-auto",
                      )}
                      style={{ background: activeAccent.color, color: "hsl(var(--ink))" }}
                    >
                      {state.badge}
                    </span>
                  )}
                  {state.showTitle && (
                    <h2
                      className="leading-tight text-white drop-shadow-md"
                      style={{
                        fontFamily: activeFont.display,
                        fontSize: effTitleSize,
                        fontWeight: state.titleWeight,
                        fontStyle: state.titleItalic ? "italic" : "normal",
                        textTransform: effUppercase ? "uppercase" : "none",
                      }}
                    >
                      {state.title || " "}
                    </h2>
                  )}
                  {state.showSubtitle && state.subtitle && (
                    <p
                      className="mt-1 text-[11px] uppercase tracking-[0.35em]"
                      style={{ color: activeAccent.color }}
                    >
                      {state.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="uppercase tracking-[0.3em]">{activeFormat.label}</span>
                <span>Variant {state.variantSeed} · {profile.label}</span>
              </div>
            </div>
          </div>

          {/* Quick actions row */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <QuickBtn icon={<Copy className="h-3.5 w-3.5" />} label="Dupliquer" />
            <QuickBtn icon={<Share2 className="h-3.5 w-3.5" />} label="Partager" />
            <QuickBtn icon={<Wand2 className="h-3.5 w-3.5" />} label="IA Auto" />
          </div>
        </section>

        {/* Right panel — tabbed */}
        <aside className="order-2 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Customize</p>
            <h1 className="font-display text-2xl text-foreground">{product.title}</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {product.categoryLabel} · {product.subcategory}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl border border-border/60 bg-card/40 p-1">
            {([
              { id: "design",  label: "Design",  icon: Palette },
              { id: "text",    label: "Texte",   icon: Type },
              { id: "layers",  label: "Calques", icon: Layers },
              { id: "effects", label: "Effets",  icon: Wand2 },
            ] as const).map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-luxe",
                    isActive
                      ? "bg-gradient-gold text-[hsl(var(--ink))] shadow-glow"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" /> {t.label}
                </button>
              );
            })}
          </div>

          {/* DESIGN TAB */}
          {tab === "design" && (
            <>
              <Section icon={<ImageIcon className="h-3.5 w-3.5" />} label="Format">
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => set({ format: f.id })}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-xs transition-luxe",
                        state.format === f.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border bg-card text-foreground/80 hover:border-gold/40"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </Section>

              <Section icon={<Palette className="h-3.5 w-3.5" />} label="Palette">
                <div className="grid grid-cols-3 gap-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => set({ palette: p.id })}
                      className={cn(
                        "group flex flex-col items-stretch overflow-hidden rounded-lg border text-[10px] transition-luxe",
                        state.palette === p.id ? "border-gold ring-1 ring-gold/40" : "border-border hover:border-gold/40"
                      )}
                    >
                      <div
                        className="h-10 w-full"
                        style={{
                          background: p.kind === "gradient" || !p.kind
                            ? `linear-gradient(135deg, ${p.from}, ${p.to})`
                            : p.css,
                          backgroundSize: "cover",
                        }}
                      />
                      <span className="bg-card px-1.5 py-1 text-foreground/80">
                        {state.palette === p.id && <Check className="mr-1 inline h-2.5 w-2.5 text-gold" />}
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
                <Slider
                  label="Opacité fond"
                  value={state.paletteOpacity}
                  min={20} max={100}
                  onChange={(v) => set({ paletteOpacity: v })}
                  unit="%"
                />
              </Section>

              <Section icon={<CircleDot className="h-3.5 w-3.5" />} label="Accent">
                <div className="flex flex-wrap gap-2">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => set({ accent: a.id })}
                      aria-label={a.label}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-luxe",
                        state.accent === a.id ? "border-gold scale-110" : "border-border hover:scale-105"
                      )}
                      style={{ background: a.color }}
                    />
                  ))}
                </div>
              </Section>

              <Section icon={<Sparkles className="h-3.5 w-3.5" />} label="Variantes">
                <p className="mb-2 text-[10px] text-muted-foreground">
                  Chaque variante change layout, contraste, échelle et overlay — pas seulement la couleur.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {VARIANTS.map((v) => {
                    const p = VARIANT_PROFILES[v];
                    const active = state.variantSeed === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => set({ variantSeed: v })}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-luxe",
                          active
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border bg-card text-foreground/80 hover:border-gold/40"
                        )}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-widest">{v}</span>
                        <span className="text-[10px] text-foreground/60">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Section>
            </>
          )}

          {/* TEXT TAB */}
          {tab === "text" && (
            <>
              <Section icon={<Type className="h-3.5 w-3.5" />} label="Contenu">
                <Field label="Titre">
                  <input
                    value={state.title}
                    onChange={(e) => set({ title: e.target.value })}
                    placeholder="Titre"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-luxe focus:border-gold/50"
                  />
                </Field>
                <Field label="Sous-titre">
                  <input
                    value={state.subtitle}
                    onChange={(e) => set({ subtitle: e.target.value })}
                    placeholder="Sous-titre"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-luxe focus:border-gold/50"
                  />
                </Field>
                <Field label="Badge">
                  <input
                    value={state.badge}
                    onChange={(e) => set({ badge: e.target.value })}
                    placeholder="PREMIUM"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-luxe focus:border-gold/50"
                  />
                </Field>
              </Section>

              <Section icon={<Type className="h-3.5 w-3.5" />} label="Typographie">
                <div className="grid gap-2">
                  {FONT_PAIRS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => set({ font: f.id })}
                      style={{ fontFamily: f.display }}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-sm transition-luxe",
                        state.font === f.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border bg-card text-foreground/80 hover:border-gold/40"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <Slider label="Taille titre" value={state.titleSize} min={14} max={64} onChange={(v) => set({ titleSize: v })} unit="px" />
                <Slider label="Graisse" value={state.titleWeight} min={300} max={700} step={100} onChange={(v) => set({ titleWeight: v })} />

                <div className="grid grid-cols-2 gap-2">
                  <ToggleGroup
                    label="Alignement"
                    options={[
                      { id: "left",   icon: <AlignLeft className="h-3.5 w-3.5" /> },
                      { id: "center", icon: <AlignCenter className="h-3.5 w-3.5" /> },
                      { id: "right",  icon: <AlignRight className="h-3.5 w-3.5" /> },
                    ]}
                    value={state.titleAlign}
                    onChange={(v) => set({ titleAlign: v as "left" | "center" | "right" })}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Style</span>
                    <div className="flex gap-1">
                      <IconToggle active={state.titleItalic} onClick={() => dispatch({ type: "toggle", key: "titleItalic" })}>
                        <Italic className="h-3.5 w-3.5" />
                      </IconToggle>
                      <IconToggle active={state.titleUppercase} onClick={() => dispatch({ type: "toggle", key: "titleUppercase" })}>
                        <Bold className="h-3.5 w-3.5" />
                      </IconToggle>
                    </div>
                  </div>
                </div>

                <div className="mt-2 border-t border-border/60 pt-3">
                  <p className="mb-2 text-[10px] uppercase tracking-widest text-gold/80">Position du texte</p>
                  <Slider label="Décalage X" value={state.textX} min={-50} max={50} onChange={(v) => set({ textX: v })} unit="%" />
                  <Slider label="Décalage Y" value={state.textY} min={-50} max={50} onChange={(v) => set({ textY: v })} unit="%" />
                  <button
                    type="button"
                    onClick={() => set({ textX: 0, textY: 0 })}
                    className="mt-1 inline-flex w-full items-center justify-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] text-foreground/70 transition-luxe hover:border-gold/40 hover:text-gold"
                  >
                    <RotateCcw className="h-2.5 w-2.5" /> Recentrer
                  </button>
                </div>
              </Section>
            </>
          )}

          {/* LAYERS TAB */}
          {tab === "layers" && (
            <>
              <Section icon={<Layers className="h-3.5 w-3.5" />} label="Calques">
                <LayerRow label="Arrière-plan" visible={state.showBackground} onToggle={() => dispatch({ type: "toggle", key: "showBackground" })} />
                <LayerRow label="Logo EVENA"   visible={state.showLogo}       onToggle={() => dispatch({ type: "toggle", key: "showLogo" })} />
                <LayerRow label="Badge"        visible={state.showBadge}      onToggle={() => dispatch({ type: "toggle", key: "showBadge" })} />
                <LayerRow label="Titre"        visible={state.showTitle}      onToggle={() => dispatch({ type: "toggle", key: "showTitle" })} />
                <LayerRow label="Sous-titre"   visible={state.showSubtitle}   onToggle={() => dispatch({ type: "toggle", key: "showSubtitle" })} />

                <div className="mt-3 border-t border-border/60 pt-3">
                  <Slider label="Coins arrondis" value={state.rounded} min={0} max={32} onChange={(v) => set({ rounded: v })} unit="px" />
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs">
                    <span className="text-foreground/80">Ombre portée</span>
                    <Switch active={state.shadow} onClick={() => dispatch({ type: "toggle", key: "shadow" })} />
                  </div>
                </div>
              </Section>

              {/* User image upload */}
              <Section icon={<ImageIcon className="h-3.5 w-3.5" />} label="Photo / Visuel">
                <ImageUploader
                  value={state.userImage}
                  onChange={(v) => set({ userImage: v })}
                  emptyLabel="Importer une photo de fond"
                />
                {state.userImage && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {(["cover", "contain", "fill"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => set({ imageMode: m })}
                          className={cn(
                            "rounded-lg border px-2 py-1.5 text-[11px] capitalize transition-luxe",
                            state.imageMode === m
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-border bg-card text-foreground/80 hover:border-gold/40"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <p className="rounded-md border border-gold/20 bg-gold/5 px-2 py-1.5 text-[10px] text-gold/80">
                      💡 Astuce : glissez directement la photo dans l'aperçu pour la déplacer.
                    </p>
                    <Slider label="Zoom" value={state.imageScale} min={50} max={300} onChange={(v) => set({ imageScale: v })} unit="%" />
                    <Slider label="Rotation" value={state.imageRotate} min={-180} max={180} onChange={(v) => set({ imageRotate: v })} unit="°" />
                    <Slider label="Position X" value={state.imageX} min={-100} max={100} onChange={(v) => set({ imageX: v })} unit="%" />
                    <Slider label="Position Y" value={state.imageY} min={-100} max={100} onChange={(v) => set({ imageY: v })} unit="%" />
                    <Slider label="Opacité" value={state.imageOpacity} min={0} max={100} onChange={(v) => set({ imageOpacity: v })} unit="%" />

                    <Field label="Style de fusion (look)">
                      <BlendLookGrid
                        src={state.userImage}
                        value={state.imageBlend}
                        kind="photo"
                        onChange={(b) => set({ imageBlend: b as State["imageBlend"] })}
                      />
                    </Field>

                    <div className="rounded-lg border border-border/60 bg-card/40 p-2">
                      <p className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Avant / Après</p>
                      <div className="grid grid-cols-2 gap-2">
                        <BeforeAfterTile
                          src={state.userImage} blend="normal" label="Avant" kind="photo"
                          crop={{ scale: state.imageScale, x: state.imageX, y: state.imageY, rotate: state.imageRotate, opacity: state.imageOpacity }}
                        />
                        <BeforeAfterTile
                          src={state.userImage} blend={state.imageBlend} label="Après" kind="photo"
                          crop={{ scale: state.imageScale, x: state.imageX, y: state.imageY, rotate: state.imageRotate, opacity: state.imageOpacity }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => set({ userImage: null, imageScale: 100, imageX: 0, imageY: 0, imageRotate: 0, imageOpacity: 100, imageBlend: "normal" })}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-[11px] text-destructive transition-luxe hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" /> Retirer la photo
                    </button>
                  </>
                )}
              </Section>

              {/* User logo upload */}
              <Section icon={<Sparkles className="h-3.5 w-3.5" />} label="Mon logo">
                <ImageUploader
                  value={state.userLogo}
                  onChange={(v) => set({ userLogo: v })}
                  emptyLabel="Importer un logo (PNG transparent)"
                />
                {state.userLogo && (
                  <>
                    <Slider label="Taille" value={state.logoSize} min={24} max={160} onChange={(v) => set({ logoSize: v })} unit="px" />
                    <Slider label="Opacité" value={state.logoOpacity} min={0} max={100} onChange={(v) => set({ logoOpacity: v })} unit="%" />
                    <Field label="Position">
                      <div className="grid grid-cols-4 gap-1.5">
                        {([
                          { id: "tl", label: "↖" },
                          { id: "tr", label: "↗" },
                          { id: "bl", label: "↙" },
                          { id: "br", label: "↘" },
                        ] as const).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => set({ logoCorner: c.id })}
                            className={cn(
                              "rounded-lg border py-1.5 text-sm transition-luxe",
                              state.logoCorner === c.id
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-border bg-card text-foreground/70 hover:border-gold/40"
                            )}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Style de fusion logo">
                      <BlendLookGrid
                        src={state.userLogo}
                        value={state.logoBlend}
                        kind="logo"
                        onChange={(b) => set({ logoBlend: b as State["logoBlend"] })}
                      />
                    </Field>
                    <div className="rounded-lg border border-border/60 bg-card/40 p-2">
                      <p className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Avant / Après</p>
                      <div className="grid grid-cols-2 gap-2">
                        <BeforeAfterTile src={state.userLogo} blend="normal" label="Avant" kind="logo" />
                        <BeforeAfterTile src={state.userLogo} blend={state.logoBlend} label="Après" kind="logo" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => set({ userLogo: null })}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-[11px] text-destructive transition-luxe hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" /> Retirer le logo
                    </button>
                  </>
                )}
              </Section>
            </>
          )}

          {/* EFFECTS TAB */}
          {tab === "effects" && (
            <>
              <Section icon={<Sun className="h-3.5 w-3.5" />} label="Ajustements">
                <Slider label="Luminosité" value={state.brightness} min={50} max={150} onChange={(v) => set({ brightness: v })} unit="%" />
                <Slider label="Contraste"  value={state.contrast}   min={50} max={150} onChange={(v) => set({ contrast: v })}   unit="%" />
                <Slider label="Saturation" value={state.saturation} min={0}  max={200} onChange={(v) => set({ saturation: v })} unit="%" />
                <Slider label="Flou"       value={state.blur}       min={0}  max={12}  onChange={(v) => set({ blur: v })}       unit="px" />
              </Section>

              <Section icon={<Wand2 className="h-3.5 w-3.5" />} label="Texture / Overlay">
                <div className="grid grid-cols-3 gap-2">
                  {OVERLAYS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => set({ overlay: o.id })}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-xs transition-luxe",
                        state.overlay === o.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border bg-card text-foreground/80 hover:border-gold/40"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Section>
            </>
          )}

          <button
            type="button"
            className="w-full rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold tracking-wide text-[hsl(var(--ink))] shadow-glow transition-luxe hover:scale-[1.01]"
          >
            Enregistrer le projet
          </button>
        </aside>
      </div>
    </div>
  );
}

/* ----------- Subcomponents ----------- */

function Section({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <p className="mb-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.35em] text-gold/80">
        {icon} {label}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, unit = "" }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-gold">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="evena-slider w-full"
      />
    </div>
  );
}

function LayerRow({ label, visible, onToggle }: { label: string; visible: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs">
      <span className="text-foreground/80">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={visible}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] uppercase tracking-widest transition-luxe",
          visible ? "border-gold/50 text-gold" : "border-border text-muted-foreground"
        )}
      >
        {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {visible ? "Visible" : "Masqué"}
      </button>
    </div>
  );
}

function Switch({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative h-5 w-9 rounded-full transition-luxe",
        active ? "bg-gradient-gold" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-luxe",
          active ? "left-[18px]" : "left-0.5"
        )}
      />
    </button>
  );
}

function IconToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg border transition-luxe",
        active ? "border-gold bg-gold/10 text-gold" : "border-border bg-card text-foreground/70 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ToggleGroup({ label, options, value, onChange }: {
  label: string;
  options: { id: string; icon: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "grid h-8 flex-1 place-items-center rounded-lg border transition-luxe",
              value === o.id ? "border-gold bg-gold/10 text-gold" : "border-border bg-card text-foreground/70 hover:text-foreground"
            )}
          >
            {o.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-[11px] text-foreground/80 transition-luxe hover:border-gold/40 hover:text-foreground"
    >
      {icon} {label}
    </button>
  );
}

function ImageUploader({
  value, onChange, emptyLabel,
}: { value: string | null; onChange: (v: string | null) => void; emptyLabel: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Image trop lourde (max 8 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) readFile(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative block w-full overflow-hidden rounded-lg border border-border bg-card transition-luxe hover:border-gold/50"
        >
          <img src={value} alt="aperçu" className="h-24 w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-background/60 text-[11px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5"><Upload className="h-3 w-3" /> Remplacer</span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) readFile(f);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-5 text-[11px] transition-luxe",
            dragOver
              ? "border-gold bg-gold/10 text-gold"
              : "border-border bg-card/60 text-muted-foreground hover:border-gold/40 hover:text-foreground"
          )}
        >
          <Upload className="h-4 w-4" />
          {emptyLabel}
          <span className="text-[10px] opacity-70">Glissez-déposez ou cliquez · max 8 Mo</span>
        </button>
      )}
    </div>
  );
}

/* ----------- Live drag/crop image layer ----------- */

function DraggableImageLayer({
  src, mode, scale, x, y, rotate, opacity, blend, onMove,
}: {
  src: string;
  mode: "cover" | "contain" | "fill";
  scale: number;
  x: number;
  y: number;
  rotate: number;
  opacity: number;
  blend: State["imageBlend"];
  onMove: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
    startRef.current = { px: e.clientX, py: e.clientY, x, y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !startRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - startRef.current.px) / rect.width) * 100;
    const dyPct = ((e.clientY - startRef.current.py) / rect.height) * 100;
    const nx = Math.max(-100, Math.min(100, Math.round(startRef.current.x + dxPct)));
    const ny = Math.max(-100, Math.min(100, Math.round(startRef.current.y + dyPct)));
    onMove(nx, ny);
  };
  const onPointerUp = () => { setDragging(false); startRef.current = null; };

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 z-10 overflow-hidden touch-none", dragging ? "cursor-grabbing" : "cursor-grab")}
      style={{ opacity: opacity / 100, mixBlendMode: blend }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={src}
        alt="Visuel utilisateur"
        className="absolute left-1/2 top-1/2 h-full w-full max-w-none select-none"
        style={{
          objectFit: mode,
          transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}%)) scale(${scale / 100}) rotate(${rotate}deg)`,
          transformOrigin: "center",
        }}
        draggable={false}
      />
      {dragging && <div className="pointer-events-none absolute inset-0 ring-2 ring-gold/60" />}
      <div className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[9px] font-medium uppercase tracking-widest text-white/90 backdrop-blur">
        <Move className="h-2.5 w-2.5" /> Glisser
      </div>
    </div>
  );
}

/* ----------- Curated blend "looks" — chaque preset = mode + ambiance soignée ----------- */

type BlendMode = React.CSSProperties["mixBlendMode"];

interface BlendLook {
  id: string;             // === blend mode CSS
  label: string;          // french friendly name
  mode: BlendMode;
  // backdrop CSS gradient used in the small preview tile
  backdrop: string;
}

// Looks adaptés aux PHOTOS de fond — sélection IMPACTANTE (gradients riches, contrastes forts)
const PHOTO_LOOKS: BlendLook[] = [
  { id: "normal",      label: "Original",   mode: "normal",
    backdrop: "linear-gradient(135deg,#1a1410,#0a0805)" },
  { id: "overlay",     label: "Cinéma Or",  mode: "overlay",
    backdrop: "radial-gradient(70% 70% at 30% 30%,hsl(43 95% 55% / .95),transparent 60%),linear-gradient(180deg,#1a1208,#07050a)" },
  { id: "screen",      label: "Néon Pulse", mode: "screen",
    backdrop: "radial-gradient(circle at 30% 30%,hsl(310 100% 60% / .85),transparent 55%),radial-gradient(circle at 75% 75%,hsl(190 100% 55% / .8),transparent 55%),#0a0612" },
  { id: "multiply",    label: "Velours Noir", mode: "multiply",
    backdrop: "radial-gradient(80% 60% at 50% 50%,hsl(280 60% 45% / .9),transparent 70%),linear-gradient(135deg,#1a0820,#050208)" },
  { id: "soft-light",  label: "Soyeux",     mode: "soft-light",
    backdrop: "linear-gradient(135deg,hsl(43 95% 60%),hsl(15 80% 45%),hsl(330 70% 40%))" },
  { id: "color-dodge", label: "Solaire",    mode: "color-dodge",
    backdrop: "radial-gradient(70% 70% at 50% 50%,hsl(35 100% 55% / .9),hsl(15 90% 40% / .6),transparent 80%),#1a0a05" },
  { id: "difference",  label: "Inverse",    mode: "difference",
    backdrop: "linear-gradient(135deg,hsl(190 100% 55%),hsl(310 100% 60%))" },
  { id: "exclusion",   label: "Risograph",  mode: "exclusion",
    backdrop: "linear-gradient(135deg,hsl(35 95% 60%),hsl(0 80% 50%),hsl(280 70% 45%))" },
  { id: "hue",         label: "Mood Shift", mode: "hue",
    backdrop: "conic-gradient(from 0deg,hsl(0 80% 55%),hsl(60 80% 55%),hsl(180 80% 55%),hsl(280 80% 55%),hsl(0 80% 55%))" },
  { id: "color",       label: "Teinte Or",  mode: "color",
    backdrop: "linear-gradient(135deg,hsl(43 95% 55%),hsl(35 80% 30%))" },
  { id: "luminosity",  label: "Mono Doré",  mode: "luminosity",
    backdrop: "linear-gradient(135deg,hsl(43 95% 60%),hsl(38 70% 35%))" },
  { id: "darken",      label: "Profond",    mode: "darken",
    backdrop: "radial-gradient(80% 60% at 50% 30%,hsl(40 30% 95%),hsl(35 20% 60%))" },
];

// Looks adaptés aux LOGOS — IMPACT visuel maximisé
const LOGO_LOOKS: BlendLook[] = [
  { id: "normal",      label: "Original",   mode: "normal",
    backdrop: "linear-gradient(135deg,#1a1410,#0a0805)" },
  { id: "screen",      label: "Halo",       mode: "screen",
    backdrop: "radial-gradient(circle at 50% 50%,hsl(43 95% 55% / .8),transparent 70%),#0a0612" },
  { id: "color-dodge", label: "Néon Vif",   mode: "color-dodge",
    backdrop: "radial-gradient(circle at 30% 30%,hsl(310 100% 60% / .8),transparent 60%),radial-gradient(circle at 70% 70%,hsl(190 100% 55% / .8),transparent 60%),#0a0612" },
  { id: "overlay",     label: "Embossé Or", mode: "overlay",
    backdrop: "linear-gradient(135deg,hsl(43 95% 60%),hsl(38 70% 35%))" },
  { id: "soft-light",  label: "Délicat",    mode: "soft-light",
    backdrop: "linear-gradient(135deg,hsl(43 80% 55%),hsl(38 65% 38%))" },
  { id: "multiply",    label: "Encre",      mode: "multiply",
    backdrop: "linear-gradient(135deg,hsl(40 30% 95%),hsl(35 20% 75%))" },
  { id: "difference",  label: "Inverse",    mode: "difference",
    backdrop: "linear-gradient(135deg,hsl(0 0% 95%),hsl(0 0% 60%))" },
  { id: "exclusion",   label: "Spectral",   mode: "exclusion",
    backdrop: "linear-gradient(135deg,hsl(280 80% 55%),hsl(190 90% 55%))" },
  { id: "hue",         label: "Couleur",    mode: "hue",
    backdrop: "conic-gradient(from 90deg,hsl(43 95% 55%),hsl(310 90% 55%),hsl(190 90% 55%),hsl(43 95% 55%))" },
  { id: "luminosity",  label: "Mono Or",    mode: "luminosity",
    backdrop: "linear-gradient(135deg,hsl(43 95% 60%),hsl(38 70% 35%))" },
  { id: "saturation",  label: "Vibrant",    mode: "saturation",
    backdrop: "linear-gradient(135deg,hsl(310 100% 55%),hsl(190 100% 55%))" },
  { id: "lighten",     label: "Aérien",     mode: "lighten",
    backdrop: "linear-gradient(180deg,#1a1208,#000)" },
];

function BlendLookGrid({
  src, value, kind, onChange,
}: {
  src: string | null;
  value: string;
  kind: "photo" | "logo";
  onChange: (v: string) => void;
}) {
  const looks = kind === "photo" ? PHOTO_LOOKS : LOGO_LOOKS;
  const { favs, isFav, toggle } = useBlendFavorites(kind);

  // Pin favorites first, preserving favs order, then the rest in original order.
  const ordered = useMemo(() => {
    const favLooks = favs
      .map((id) => looks.find((l) => l.id === id))
      .filter((l): l is BlendLook => Boolean(l));
    const rest = looks.filter((l) => !favs.includes(l.id));
    return [...favLooks, ...rest];
  }, [favs, looks]);

  return (
    <div>
      {favs.length > 0 && (
        <p className="mb-1.5 inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold/70">
          <Star className="h-2.5 w-2.5 fill-gold" /> Favoris épinglés ({favs.length}/3)
        </p>
      )}
      <div className="grid grid-cols-4 gap-2">
        {ordered.map((l) => {
          const active = value === l.id;
          const fav = isFav(l.id);
          const pinned = fav;
          return (
            <div key={l.id} className="relative">
              <button
                type="button"
                onClick={() => onChange(l.id)}
                title={l.label}
                className={cn(
                  "group flex w-full flex-col items-stretch overflow-hidden rounded-lg border transition-luxe",
                  active
                    ? "border-gold ring-1 ring-gold/50 shadow-glow"
                    : pinned
                    ? "border-gold/40"
                    : "border-border hover:border-gold/40"
                )}
              >
                <div
                  className="relative aspect-square w-full"
                  style={{ background: l.backdrop }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      className={cn(
                        "absolute inset-0 h-full w-full select-none",
                        kind === "logo" ? "object-contain p-2" : "object-cover"
                      )}
                      style={{ mixBlendMode: l.mode }}
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-[9px] text-white/50">—</div>
                  )}
                  {active && (
                    <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-gold text-[9px] text-[hsl(var(--ink))]">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "px-1.5 py-1 text-center text-[10px] font-medium tracking-wide",
                    active ? "bg-gold/10 text-gold" : "bg-card text-foreground/80"
                  )}
                >
                  {l.label}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggle(l.id); }}
                aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                title={fav ? "Retirer des favoris" : "Épingler ce look (max 3)"}
                className={cn(
                  "absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full border backdrop-blur transition-luxe",
                  fav
                    ? "border-gold bg-gold text-[hsl(var(--ink))]"
                    : "border-white/30 bg-black/40 text-white/80 hover:border-gold hover:text-gold"
                )}
              >
                <Star className={cn("h-2.5 w-2.5", fav && "fill-current")} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BeforeAfterCrop {
  scale?: number;     // %
  x?: number;         // %
  y?: number;         // %
  rotate?: number;    // deg
  opacity?: number;   // %
}

function BeforeAfterTile({
  src, blend, label, kind = "photo", crop,
}: { src: string | null; blend: string; label: string; kind?: "photo" | "logo"; crop?: BeforeAfterCrop }) {
  const scale = (crop?.scale ?? 100) / 100;
  const x = crop?.x ?? 0;
  const y = crop?.y ?? 0;
  const rotate = crop?.rotate ?? 0;
  const opacity = (crop?.opacity ?? 100) / 100;
  return (
    <div className="overflow-hidden rounded-md border border-border/60">
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%,hsl(43 80% 55% / .9),transparent 60%),linear-gradient(180deg,#1a1208,#07050a)",
        }}
      >
        {src && (
          <img
            src={src}
            alt={label}
            className={cn(
              "absolute left-1/2 top-1/2 h-full w-full max-w-none",
              kind === "logo" ? "object-contain p-2" : "object-cover"
            )}
            style={{
              mixBlendMode: blend as BlendMode,
              opacity,
              transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}%)) scale(${scale}) rotate(${rotate}deg)`,
              transformOrigin: "center",
            }}
          />
        )}
      </div>
      <p className="bg-card px-1.5 py-0.5 text-center text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
