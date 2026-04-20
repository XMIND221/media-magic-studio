import { useMemo } from "react";
import type { MarketplaceProduct, MarketplaceCategory } from "@/data/evenaMarketplaceCatalog";
import { hashSeed, mulberry32, pick, range } from "@/lib/seed";

/**
 * Procedural premium thumbnail engine.
 * Each card gets a deterministic unique composition driven by `designSeed`.
 * Archetype is chosen by category + title heuristics.
 */

type Archetype =
  | "invitation-portrait"
  | "save-the-date"
  | "ticket-horizontal"
  | "ticket-mini"
  | "badge-lanyard"
  | "badge-round"
  | "pass-noir-or"
  | "business-card"
  | "menu-editorial"
  | "ceremony-frame"
  | "boarding-pass"
  | "promo-poster"
  | "loyalty-card"
  | "festival-poster";

function archetypeFor(p: MarketplaceProduct): Archetype {
  const t = p.title.toLowerCase();
  // Specific overrides
  if (t.includes("save the date")) return "save-the-date";
  if (t.includes("boarding")) return "boarding-pass";
  if (t.includes("menu")) return "menu-editorial";
  if (
    t.includes("tabaski") ||
    t.includes("ramadan") ||
    t.includes("magal") ||
    t.includes("gamou") ||
    t.includes("religieux") ||
    t.includes("religieuse") ||
    t.includes("communion") ||
    t.includes("deuil") ||
    t.includes("prière") ||
    t.includes("don")
  ) {
    return "ceremony-frame";
  }
  if (t.includes("festival") && p.category === "invitations") return "festival-poster";
  if (t.includes("festival") && p.category === "tickets") return "ticket-horizontal";
  if (p.category === "invitations") {
    return p.index % 2 === 0 ? "invitation-portrait" : "invitation-portrait";
  }
  if (p.category === "tickets") {
    return p.index % 3 === 0 ? "ticket-mini" : "ticket-horizontal";
  }
  if (p.category === "badges") {
    return p.index % 4 === 0 ? "badge-round" : "badge-lanyard";
  }
  if (p.category === "vip") return "pass-noir-or";
  if (p.category === "business") return "business-card";
  if (p.category === "restaurant") return p.index % 2 === 0 ? "menu-editorial" : "loyalty-card";
  if (p.category === "education") return p.index % 2 === 0 ? "business-card" : "badge-lanyard";
  if (p.category === "sport") {
    if (t.includes("ticket")) return "ticket-horizontal";
    if (t.includes("badge")) return "badge-lanyard";
    if (t.includes("pass")) return "pass-noir-or";
    return "loyalty-card";
  }
  if (p.category === "voyage") {
    if (t.includes("boarding")) return "boarding-pass";
    if (t.includes("ticket")) return "ticket-horizontal";
    if (t.includes("pass")) return "pass-noir-or";
    return "loyalty-card";
  }
  if (p.category === "commerce") return p.index % 2 === 0 ? "promo-poster" : "loyalty-card";
  return "invitation-portrait";
}

// Palettes — all luxe (noir + or variants) with subtle accent shifts
const PALETTES = [
  { bg: "#0F0D0A", ink: "#F5EBD3", gold: "#D4AF37", accent: "#7B5A1A" }, // noir/or classique
  { bg: "#120F0B", ink: "#EFE3C8", gold: "#E2C36B", accent: "#5C4514" }, // chaud
  { bg: "#0B0E10", ink: "#E8E2CF", gold: "#C9A24A", accent: "#2A3036" }, // graphite
  { bg: "#16100A", ink: "#F2E1B4", gold: "#EBC76A", accent: "#8C5A1F" }, // ambré
  { bg: "#0A0A0A", ink: "#F2EAD3", gold: "#D9B978", accent: "#1B1B1B" }, // pur noir
  { bg: "#1A120B", ink: "#EAD9B0", gold: "#D2A24C", accent: "#6E3B1A" }, // bois précieux
  { bg: "#0E0B14", ink: "#EBDFC6", gold: "#C8A45B", accent: "#3A2A4A" }, // soir profond
  { bg: "#0C0E0B", ink: "#E8E0C2", gold: "#C9A862", accent: "#1F2A1F" }, // émeraude sombre
];

type Palette = (typeof PALETTES)[number];

export type ImageSlotMode = "placeholder" | "demo" | "none";

interface Overrides {
  archetype?: Archetype;
  palette?: Partial<Palette>;
  ornament?: "kente" | "bogolan" | "geometric" | "wave" | "dots" | "starburst";
  imageSlot?: ImageSlotMode;
}

interface Props {
  product: MarketplaceProduct;
  variantSeed?: string; // used in detail page for 10 variants
  className?: string;
  overrides?: Overrides;
}

export function ProductThumbnail({ product, variantSeed, className, overrides }: Props) {
  const seedKey = (product.designSeed + (variantSeed ?? "") + (overrides ? JSON.stringify(overrides) : "")) as string;
  const { archetype, palette, params, imageSlot } = useMemo(() => {
    const rng = mulberry32(hashSeed(seedKey));
    const basePalette = PALETTES[Math.floor(rng() * PALETTES.length)];
    const palette: Palette = { ...basePalette, ...(overrides?.palette ?? {}) };
    const archetype = overrides?.archetype ?? archetypeFor(product);
    const params = {
      rotation: range(rng, -3, 3),
      ornament: overrides?.ornament ?? pick(rng, ["kente", "bogolan", "geometric", "wave", "dots", "starburst"] as const),
      monogramRot: range(rng, -8, 8),
      r1: rng(),
      r2: rng(),
      r3: rng(),
      r4: rng(),
      r5: rng(),
    };
    const imageSlot: ImageSlotMode = overrides?.imageSlot ?? "none";
    return { archetype, palette, params, imageSlot };
  }, [seedKey, product, overrides]);

  return (
    <div
      className={"relative w-full overflow-hidden rounded-xl bg-gradient-noir " + (className ?? "")}
      style={{ aspectRatio: aspectFor(archetype) }}
    >
      <Composition product={product} archetype={archetype} palette={palette} params={params} imageSlot={imageSlot} />
    </div>
  );
}

function aspectFor(a: Archetype): string {
  switch (a) {
    case "ticket-horizontal":
    case "boarding-pass":
    case "business-card":
      return "16/10";
    case "ticket-mini":
      return "5/3";
    case "badge-round":
      return "1/1";
    case "badge-lanyard":
      return "3/4";
    case "pass-noir-or":
    case "loyalty-card":
      return "16/10";
    case "menu-editorial":
    case "ceremony-frame":
    case "save-the-date":
    case "festival-poster":
    case "promo-poster":
    case "invitation-portrait":
    default:
      return "3/4";
  }
}

interface CompProps {
  product: MarketplaceProduct;
  archetype: Archetype;
  palette: Palette;
  params: {
    rotation: number;
    ornament: "kente" | "bogolan" | "geometric" | "wave" | "dots" | "starburst";
    monogramRot: number;
    r1: number; r2: number; r3: number; r4: number; r5: number;
  };
  imageSlot: ImageSlotMode;
}

function Composition({ product, archetype, palette, params, imageSlot }: CompProps) {
  const monogram = monogramFor(product.title);
  const sub = { product, palette, params, monogram, imageSlot };
  switch (archetype) {
    case "invitation-portrait": return <InvitationPortrait {...sub} />;
    case "save-the-date": return <SaveTheDate {...sub} />;
    case "ticket-horizontal": return <TicketHorizontal {...sub} />;
    case "ticket-mini": return <TicketMini {...sub} />;
    case "badge-lanyard": return <BadgeLanyard {...sub} />;
    case "badge-round": return <BadgeRound {...sub} />;
    case "pass-noir-or": return <PassNoirOr {...sub} />;
    case "business-card": return <BusinessCard {...sub} />;
    case "menu-editorial": return <MenuEditorial {...sub} />;
    case "ceremony-frame": return <CeremonyFrame {...sub} />;
    case "boarding-pass": return <BoardingPass {...sub} />;
    case "promo-poster": return <PromoPoster {...sub} />;
    case "loyalty-card": return <LoyaltyCard {...sub} />;
    case "festival-poster": return <FestivalPoster {...sub} />;
  }
}

function monogramFor(title: string): string {
  const words = title.replace(/[^\p{L}\s]/gu, "").split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  return letters || "EV";
}

interface SubProps {
  product: MarketplaceProduct;
  palette: Palette;
  params: CompProps["params"];
  monogram: string;
  imageSlot: ImageSlotMode;
}

/* ---------- Image slot (placeholder OR procedural demo) ---------- */

function ImageSlot({
  mode,
  palette,
  seed,
  className = "",
  label = "Votre photo",
}: {
  mode: ImageSlotMode;
  palette: Palette;
  seed: number;
  className?: string;
  label?: string;
}) {
  if (mode === "none") return null;

  if (mode === "demo") {
    // Démo procédurale : "fausse photo" avec gradient + formes organiques
    const angle = Math.floor(seed * 360);
    const cx = 30 + (seed * 40);
    const cy = 30 + ((seed * 17) % 40);
    return (
      <div
        className={"relative overflow-hidden " + className}
        style={{
          background: `linear-gradient(${angle}deg, ${palette.accent}, ${palette.bg} 60%, ${palette.gold}40)`,
        }}
        aria-label="Aperçu image"
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <radialGradient id={`img-glow-${Math.floor(seed * 1e6)}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={palette.gold} stopOpacity="0.45" />
              <stop offset="100%" stopColor={palette.bg} stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={cx} cy={cy} rx="55" ry="40" fill={`url(#img-glow-${Math.floor(seed * 1e6)})`} />
          <circle cx={cx + 20} cy={cy + 15} r="18" fill={palette.gold} opacity="0.18" />
          <circle cx={cx - 15} cy={cy + 25} r="10" fill={palette.ink} opacity="0.08" />
        </svg>
        {/* Filet or pour rappeler le cadre éditable */}
        <div className="absolute inset-0 ring-1 ring-inset" style={{ boxShadow: `inset 0 0 0 1px ${palette.gold}30` }} />
      </div>
    );
  }

  // mode === "placeholder"
  return (
    <div
      className={"relative flex flex-col items-center justify-center " + className}
      style={{
        background: `repeating-linear-gradient(45deg, ${palette.gold}08 0 6px, transparent 6px 12px)`,
        border: `1px dashed ${palette.gold}80`,
      }}
      aria-label="Emplacement pour ajouter une photo"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="1.5" stroke={palette.gold} strokeWidth="1.2" opacity="0.9" />
        <circle cx="9" cy="10" r="1.4" fill={palette.gold} />
        <path d="M3 17 L9 12 L13 15 L17 11 L21 16" stroke={palette.gold} strokeWidth="1.2" fill="none" />
      </svg>
      <div
        className="mt-1 text-[7px] tracking-[0.3em] uppercase"
        style={{ color: palette.gold }}
      >
        {label}
      </div>
    </div>
  );
}

/* ---------- Background patterns (SVG) ---------- */

function Pattern({ kind, color, opacity = 0.18 }: { kind: CompProps["params"]["ornament"]; color: string; opacity?: number }) {
  const id = `pat-${kind}-${Math.floor(Math.random() * 1e6)}`;
  if (kind === "kente") {
    return (
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
            <rect width="22" height="22" fill="transparent" />
            <path d="M0 11h22M11 0v22" stroke={color} strokeWidth="0.6" opacity={opacity} />
            <rect x="9" y="9" width="4" height="4" fill={color} opacity={opacity * 0.8} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  if (kind === "bogolan") {
    return (
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M0 0L14 14L0 28M28 0L14 14L28 28" fill="none" stroke={color} strokeWidth="0.7" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  if (kind === "geometric") {
    return (
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="17" cy="17" r="10" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity} />
            <circle cx="17" cy="17" r="1" fill={color} opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  if (kind === "wave") {
    return (
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  if (kind === "dots") {
    return (
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill={color} opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  // starburst
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="50" y1="50"
          x2={50 + 70 * Math.cos((i / 24) * Math.PI * 2)}
          y2={50 + 70 * Math.sin((i / 24) * Math.PI * 2)}
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

/* ---------- Reusable bits ---------- */

function GoldHairline({ color }: { color: string }) {
  return <div className="my-2 h-px w-12 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />;
}

function QRStylized({ color, size = 38 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="4" fill="transparent" stroke={color} strokeWidth="1" opacity="0.7" />
      {[3, 8, 13, 18, 23, 28, 33].map((x) =>
        [3, 8, 13, 18, 23, 28, 33].map((y) => {
          const on = (x * 7 + y * 3) % 5 < 2;
          if (!on) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill={color} opacity="0.85" />;
        })
      )}
      <rect x="3" y="3" width="9" height="9" fill="none" stroke={color} strokeWidth="1.4" />
      <rect x="28" y="3" width="9" height="9" fill="none" stroke={color} strokeWidth="1.4" />
      <rect x="3" y="28" width="9" height="9" fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

function CornerOrnament({ color }: { color: string }) {
  return (
    <svg className="absolute" width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <path d="M2 32 L2 8 Q2 2 8 2 L32 2" fill="none" stroke={color} strokeWidth="1" opacity="0.85" />
      <circle cx="2" cy="2" r="1.4" fill={color} />
    </svg>
  );
}

/* ---------- Archetype components ---------- */

function InvitationPortrait({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex flex-col p-3" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind={params.ornament} color={palette.gold} opacity={0.08} />
      <div className="absolute inset-2 rounded-md" style={{ border: `1px solid ${palette.gold}40` }} />
      <div className="absolute inset-3 rounded-md" style={{ border: `0.5px solid ${palette.gold}25` }} />
      <CornerOrnament color={palette.gold} />
      <div className="absolute right-2 top-2 -scale-x-100"><CornerOrnament color={palette.gold} /></div>
      <div className="absolute bottom-2 left-2 -scale-y-100"><CornerOrnament color={palette.gold} /></div>
      <div className="absolute bottom-2 right-2 scale-[-1]"><CornerOrnament color={palette.gold} /></div>

      <div className="relative z-10 mt-auto mb-auto text-center px-3">
        <p className="text-[8px] tracking-[0.4em] opacity-70" style={{ color: palette.gold }}>
          EVENA · INVITATION
        </p>
        <GoldHairline color={palette.gold} />
        <h3 className="font-display text-[15px] leading-tight" style={{ color: palette.ink }}>
          {product.title}
        </h3>
        <GoldHairline color={palette.gold} />
        <p className="text-[7px] tracking-[0.3em] opacity-60">DAKAR · 2025</p>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div
          className="font-display text-[10px] tracking-[0.3em]"
          style={{ color: palette.gold, transform: `rotate(${params.monogramRot}deg)` }}
        >
          {monogram}
        </div>
      </div>
    </div>
  );
}

function SaveTheDate({ product, palette, params, monogram, imageSlot }: SubProps) {
  const day = 1 + Math.floor(params.r1 * 28);
  const showImage = imageSlot !== "none";
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="dots" color={palette.gold} opacity={0.1} />
      {showImage && (
        <ImageSlot
          mode={imageSlot}
          palette={palette}
          seed={params.r4}
          className="relative h-[45%] w-full"
          label="Photo couple"
        />
      )}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-3 py-2">
        <p className="text-[8px] tracking-[0.4em]" style={{ color: palette.gold }}>SAVE THE DATE</p>
        <div className="my-1 flex items-end gap-2">
          <div className="font-display text-[34px] leading-none" style={{ color: palette.ink }}>{day}</div>
          <div className="text-left text-[7px] tracking-[0.3em] uppercase opacity-80">
            <div>Décembre</div>
            <div style={{ color: palette.gold }}>2025</div>
          </div>
        </div>
        <GoldHairline color={palette.gold} />
        <p className="font-display text-[11px]" style={{ color: palette.ink }}>{monogram} & EVENA</p>
        <p className="mt-1 text-[6px] opacity-60 tracking-[0.3em]">DAKAR</p>
      </div>
    </div>
  );
}

function TicketHorizontal({ product, palette, params, monogram, imageSlot }: SubProps) {
  const showImage = imageSlot !== "none";
  return (
    <div className="absolute inset-0 flex" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind={params.ornament} color={palette.gold} opacity={0.07} />
      <div className="relative flex flex-1 flex-col">
        {showImage && (
          <ImageSlot
            mode={imageSlot}
            palette={palette}
            seed={params.r3}
            className="h-[40%] w-full"
            label="Visuel event"
          />
        )}
        <div className="relative flex-1 p-3">
          <p className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA · TICKET</p>
          <h3 className="font-display mt-1 text-[13px] leading-tight">{product.title}</h3>
          <div className="mt-2 flex items-end gap-3">
            <div>
              <div className="text-[6px] opacity-60 tracking-[0.3em]">DATE</div>
              <div className="text-[10px] font-medium">12.12.25</div>
            </div>
            <div>
              <div className="text-[6px] opacity-60 tracking-[0.3em]">SIÈGE</div>
              <div className="text-[10px] font-medium">A-{Math.floor(params.r1 * 99) + 1}</div>
            </div>
            <div>
              <div className="text-[6px] opacity-60 tracking-[0.3em]">PRIX</div>
              <div className="text-[10px] font-medium" style={{ color: palette.gold }}>25 000 F</div>
            </div>
          </div>
        </div>
      </div>
      {/* perforation */}
      <div className="relative w-[18px] flex flex-col items-center justify-around" style={{ borderLeft: `1px dashed ${palette.gold}55`, borderRight: `1px dashed ${palette.gold}55` }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-1 w-1 rounded-full" style={{ background: palette.gold, opacity: 0.4 }} />
        ))}
      </div>
      <div className="relative w-[68px] flex flex-col items-center justify-center p-2 gap-1" style={{ background: `${palette.gold}08` }}>
        <QRStylized color={palette.gold} size={42} />
        <div className="text-[6px] tracking-[0.3em]" style={{ color: palette.gold }}>{monogram}-{Math.floor(params.r2 * 9000) + 1000}</div>
      </div>
    </div>
  );
}

function TicketMini({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: palette.bg, color: palette.ink }}>
      <div className="h-2 w-full" style={{ background: palette.gold }} />
      <div className="flex flex-1">
        <div className="flex-1 p-3">
          <p className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>ADMIT ONE</p>
          <h3 className="font-display mt-1 text-[13px] leading-tight">{product.title}</h3>
          <p className="mt-1 text-[7px] opacity-60">N° {monogram}-{Math.floor(params.r1 * 9000) + 1000}</p>
        </div>
        <div className="flex w-[50px] items-center justify-center" style={{ borderLeft: `1px dashed ${palette.gold}40` }}>
          <QRStylized color={palette.gold} size={32} />
        </div>
      </div>
      <div className="h-2 w-full" style={{ background: palette.gold }} />
    </div>
  );
}

function BadgeLanyard({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="dots" color={palette.gold} opacity={0.07} />
      {/* lanyard hole */}
      <div className="relative mt-2 h-2 w-8 rounded-full" style={{ background: palette.bg, border: `1px solid ${palette.gold}55` }} />
      <div className="relative z-10 mt-3 flex w-full flex-col items-center px-3 text-center">
        <div className="font-display text-[28px] leading-none" style={{ color: palette.gold }}>{monogram}</div>
        <div className="mt-1 text-[7px] tracking-[0.4em] opacity-70">EVENA</div>
        <GoldHairline color={palette.gold} />
        <h3 className="font-display text-[12px] leading-tight">{product.title}</h3>
        <div className="mt-3 rounded-sm px-2 py-0.5 text-[7px] tracking-[0.3em]" style={{ background: palette.gold, color: palette.bg }}>
          {product.subcategory.toUpperCase()}
        </div>
      </div>
      <div className="absolute bottom-2 flex w-full items-end justify-between px-3">
        <div className="text-[6px] opacity-60">N° {Math.floor(params.r1 * 9000) + 1000}</div>
        <QRStylized color={palette.gold} size={28} />
      </div>
    </div>
  );
}

function BadgeRound({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-2" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="starburst" color={palette.gold} opacity={0.18} />
      <div
        className="relative flex aspect-square w-[88%] items-center justify-center rounded-full"
        style={{ background: `radial-gradient(circle at 30% 30%, ${palette.gold}30, transparent 60%), ${palette.bg}`, border: `2px solid ${palette.gold}` }}
      >
        <div className="absolute inset-2 rounded-full" style={{ border: `1px dashed ${palette.gold}80` }} />
        <div className="text-center">
          <div className="font-display text-[26px] leading-none" style={{ color: palette.gold }}>{monogram}</div>
          <GoldHairline color={palette.gold} />
          <div className="px-3 font-display text-[10px] leading-tight">{product.title}</div>
          <div className="mt-1 text-[6px] tracking-[0.3em] opacity-70">EVENA</div>
        </div>
      </div>
    </div>
  );
}

function PassNoirOr({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${palette.bg}, #000)`, color: palette.ink }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 80% 20%, ${palette.gold}30, transparent 50%)` }} />
      <Pattern kind="geometric" color={palette.gold} opacity={0.07} />
      <div className="relative z-10 flex h-full flex-col p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA · PASS</div>
            <div className="font-display text-[18px] leading-none" style={{ color: palette.gold }}>{product.title.split(" ").slice(-1)[0]}</div>
          </div>
          <div className="rounded-sm px-1.5 py-0.5 text-[7px] tracking-[0.3em]" style={{ border: `1px solid ${palette.gold}` , color: palette.gold}}>
            {monogram}
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-[6px] opacity-60 tracking-[0.3em]">HOLDER</div>
            <div className="font-display text-[11px]">{product.title}</div>
            <div className="text-[6px] opacity-60 tracking-[0.3em] mt-1">VALID 2025 · DAKAR</div>
          </div>
          <QRStylized color={palette.gold} size={36} />
        </div>
        {/* gold chip */}
        <div className="absolute right-3 top-12 h-5 w-7 rounded-sm" style={{ background: `linear-gradient(135deg, ${palette.gold}, #8c6a1a)` }} />
      </div>
    </div>
  );
}

function BusinessCard({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_2px_1.4fr]" style={{ background: palette.bg, color: palette.ink }}>
      <div className="flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${palette.gold}, ${palette.accent})` }}>
        <div className="font-display text-[26px]" style={{ color: palette.bg }}>{monogram}</div>
      </div>
      <div style={{ background: palette.gold, opacity: 0.5 }} />
      <div className="relative flex flex-col justify-center p-3">
        <Pattern kind="dots" color={palette.gold} opacity={0.06} />
        <p className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA</p>
        <h3 className="font-display text-[13px] leading-tight">{product.title}</h3>
        <GoldHairline color={palette.gold} />
        <div className="text-[7px] opacity-70">contact@evena.sn</div>
        <div className="text-[7px] opacity-70">+221 33 000 00 00</div>
        <div className="absolute bottom-2 right-2"><QRStylized color={palette.gold} size={22} /></div>
      </div>
    </div>
  );
}

function MenuEditorial({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex flex-col p-3" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="wave" color={palette.gold} opacity={0.06} />
      <p className="text-[7px] tracking-[0.5em]" style={{ color: palette.gold }}>EVENA · LA CARTE</p>
      <h3 className="font-display text-[16px] leading-tight mt-1">{product.title}</h3>
      <GoldHairline color={palette.gold} />
      <div className="space-y-1 text-[8px] opacity-90 mt-1">
        {["Entrée du chef", "Plat signature", "Dessert maison"].map((t, i) => (
          <div key={i} className="flex items-baseline">
            <span className="font-display">{t}</span>
            <span className="mx-1 flex-1 border-b border-dashed" style={{ borderColor: `${palette.gold}40` }} />
            <span style={{ color: palette.gold }}>{(i + 1) * 4500} F</span>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between">
        <div className="font-display text-[20px]" style={{ color: palette.gold, transform: `rotate(${params.monogramRot}deg)` }}>{monogram}</div>
        <div className="text-[6px] opacity-60 tracking-[0.3em]">DAKAR</div>
      </div>
    </div>
  );
}

function CeremonyFrame({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 p-3" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="bogolan" color={palette.gold} opacity={0.1} />
      {/* arch */}
      <svg className="absolute inset-2" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        <path d="M5 135 L5 50 Q5 5 50 5 Q95 5 95 50 L95 135" fill="none" stroke={palette.gold} strokeWidth="0.8" />
        <path d="M9 132 L9 51 Q9 9 50 9 Q91 9 91 51 L91 132" fill="none" stroke={palette.gold} strokeWidth="0.4" opacity="0.6" />
      </svg>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-3">
        <div className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA</div>
        <div className="font-display text-[13px] mt-1 leading-tight">{product.title}</div>
        <GoldHairline color={palette.gold} />
        <div className="font-display text-[22px]" style={{ color: palette.gold }}>{monogram}</div>
        <div className="text-[6px] mt-2 tracking-[0.4em] opacity-70">SÉNÉGAL · 1446H</div>
      </div>
    </div>
  );
}

function BoardingPass({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex" style={{ background: palette.bg, color: palette.ink }}>
      <div className="relative flex-1 p-3">
        <div className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA AIR · BOARDING</div>
        <div className="mt-1 flex items-end gap-2">
          <div className="font-display text-[20px] leading-none">DKR</div>
          <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
            <path d="M0 5 H18 M14 1 L20 5 L14 9" stroke={palette.gold} strokeWidth="1" fill="none" />
          </svg>
          <div className="font-display text-[20px] leading-none">CDG</div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[7px]">
          <div><div className="opacity-60 tracking-[0.3em]">FLIGHT</div><div className="font-medium">EV{Math.floor(params.r1 * 900) + 100}</div></div>
          <div><div className="opacity-60 tracking-[0.3em]">GATE</div><div className="font-medium">B{Math.floor(params.r2 * 30) + 1}</div></div>
          <div><div className="opacity-60 tracking-[0.3em]">SEAT</div><div className="font-medium" style={{ color: palette.gold }}>1A</div></div>
        </div>
        <div className="mt-2 text-[7px] opacity-70 tracking-[0.3em]">{product.title.toUpperCase()}</div>
      </div>
      <div className="relative w-[16px]" style={{ borderLeft: `1px dashed ${palette.gold}55` }} />
      <div className="flex w-[60px] flex-col items-center justify-center gap-1" style={{ background: `${palette.gold}10` }}>
        <QRStylized color={palette.gold} size={36} />
        <div className="text-[6px]" style={{ color: palette.gold }}>{monogram}</div>
      </div>
    </div>
  );
}

function PromoPoster({ product, palette, params, monogram, imageSlot }: SubProps) {
  const pct = pick(mulberry32(hashSeed(product.designSeed + "p")), [10, 20, 30, 40, 50, 70]);
  const showImage = imageSlot !== "none";
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="starburst" color={palette.gold} opacity={0.12} />
      {showImage && (
        <ImageSlot
          mode={imageSlot}
          palette={palette}
          seed={params.r2}
          className="h-[42%] w-full"
          label="Visuel produit"
        />
      )}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-3 py-2">
        <p className="text-[8px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA · OFFRE</p>
        <div className="font-display text-[36px] leading-none" style={{ color: palette.gold }}>-{pct}%</div>
        <GoldHairline color={palette.gold} />
        <h3 className="font-display text-[11px] leading-tight">{product.title}</h3>
        <div className="mt-2 rounded-full px-3 py-0.5 text-[7px] tracking-[0.3em]" style={{ background: palette.gold, color: palette.bg }}>
          PROMO {monogram}
        </div>
      </div>
    </div>
  );
}

function LoyaltyCard({ product, palette, params, monogram }: SubProps) {
  return (
    <div className="absolute inset-0 flex flex-col p-3" style={{ background: `linear-gradient(135deg, ${palette.bg}, ${palette.accent}30)`, color: palette.ink }}>
      <Pattern kind="geometric" color={palette.gold} opacity={0.06} />
      <div className="flex items-start justify-between">
        <div className="text-[7px] tracking-[0.4em]" style={{ color: palette.gold }}>EVENA · CLUB</div>
        <div className="font-display text-[14px]" style={{ color: palette.gold }}>{monogram}</div>
      </div>
      <h3 className="font-display text-[14px] leading-tight mt-1">{product.title}</h3>
      <div className="mt-auto flex items-end justify-between">
        <div className="flex gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full" style={{ background: i < 4 ? palette.gold : `${palette.gold}30` }} />
          ))}
        </div>
        <div className="text-[7px] opacity-70 tracking-[0.3em]">N° {Math.floor(params.r1 * 9000) + 1000}</div>
      </div>
    </div>
  );
}

function FestivalPoster({ product, palette, params, monogram, imageSlot }: SubProps) {
  const showImage = imageSlot !== "none";
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: palette.bg, color: palette.ink }}>
      <Pattern kind="kente" color={palette.gold} opacity={0.18} />
      {showImage && (
        <ImageSlot
          mode={imageSlot}
          palette={palette}
          seed={params.r1}
          className="h-[58%] w-full"
          label="Affiche artiste"
        />
      )}
      <div className="relative z-10 mt-auto p-3">
        <div className="text-[7px] tracking-[0.5em]" style={{ color: palette.gold }}>EVENA · LIVE</div>
        <h3 className="font-display text-[16px] leading-[1] mt-1" style={{ color: palette.ink }}>{product.title}</h3>
        <div className="mt-2 flex items-center gap-2 text-[7px] tracking-[0.3em]">
          <span style={{ color: palette.gold }}>12.12.25</span>
          <span className="opacity-50">·</span>
          <span>DAKAR ARENA</span>
        </div>
      </div>
    </div>
  );
}
