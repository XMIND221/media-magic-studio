import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Check, Download, Sparkles, Type, Palette, Image as ImageIcon,
  Layers, Wand2, RotateCcw, Copy, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Sun, CircleDot, Save, Share2, Upload, Trash2, Move,
} from "lucide-react";
import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { ProductThumbnail } from "@/components/marketplace/ProductThumbnail";
import { MediaThumbnail } from "@/components/marketplace/MediaThumbnail";
import { cn } from "@/lib/utils";

const FORMATS = [
  { id: "story",    label: "Story 9:16",   ratio: "9/16" },
  { id: "post",     label: "Post 4:5",     ratio: "4/5"  },
  { id: "carré",    label: "Square 1:1",   ratio: "1/1"  },
  { id: "paysage",  label: "Landscape",    ratio: "16/9" },
  { id: "portrait", label: "Portrait 3:4", ratio: "3/4"  },
  { id: "banner",   label: "Banner 21:9",  ratio: "21/9" },
];

const PALETTES = [
  { id: "gold",    label: "Luxury Gold",      from: "hsl(43 80% 55%)",  to: "hsl(38 65% 38%)" },
  { id: "noir",    label: "Pure Noir",        from: "hsl(30 14% 9%)",   to: "hsl(30 14% 4%)"  },
  { id: "neon",    label: "Neon Pop",         from: "hsl(310 100% 60%)",to: "hsl(190 100% 55%)" },
  { id: "ocean",   label: "Cinematic Blue",   from: "hsl(220 70% 35%)", to: "hsl(260 60% 25%)" },
  { id: "fire",    label: "Sunset Fire",      from: "hsl(20 90% 55%)",  to: "hsl(0 80% 40%)"   },
  { id: "mint",    label: "Editorial Mint",   from: "hsl(160 50% 45%)", to: "hsl(180 40% 20%)" },
  { id: "ivory",   label: "Ivory Editorial",  from: "hsl(40 30% 92%)",  to: "hsl(35 20% 78%)"  },
  { id: "berry",   label: "Berry Velvet",     from: "hsl(330 60% 35%)", to: "hsl(290 50% 18%)" },
];

const ACCENTS = [
  { id: "gold",   color: "hsl(43 80% 55%)",  label: "Gold"   },
  { id: "white",  color: "hsl(0 0% 100%)",   label: "Ivory"  },
  { id: "rose",   color: "hsl(340 90% 65%)", label: "Rose"   },
  { id: "cyan",   color: "hsl(190 90% 60%)", label: "Cyan"   },
  { id: "lime",   color: "hsl(80 75% 60%)",  label: "Lime"   },
  { id: "coral",  color: "hsl(15 85% 60%)",  label: "Coral"  },
];

const FONT_PAIRS = [
  { id: "luxe",  label: "Cormorant + Inter",   display: '"Cormorant Garamond", serif' },
  { id: "bold",  label: "Display Bold",         display: '"Cormorant Garamond", serif' },
  { id: "edit",  label: "Editorial Serif",      display: 'Georgia, "Times New Roman", serif' },
  { id: "tech",  label: "Modern Sans",          display: '"Inter", system-ui, sans-serif' },
];

const OVERLAYS = [
  { id: "none",   label: "Aucun" },
  { id: "grain",  label: "Grain" },
  { id: "scan",   label: "Scanlines" },
  { id: "leak",   label: "Light leak" },
  { id: "vignette", label: "Vignette" },
];

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

  const filterCss = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) blur(${state.blur}px)`;

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
        <section className="order-1 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl border border-border/60 bg-gradient-noir p-4 sm:p-8">
            <div className="mx-auto" style={{ maxWidth: state.format === "banner" || state.format === "paysage" ? 640 : 420 }}>
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
                    ? `linear-gradient(135deg, ${activePalette.from}, ${activePalette.to})`
                    : "transparent",
                }}
              >
                {/* Template visual */}
                <div
                  className="absolute inset-0"
                  style={{
                    filter: filterCss,
                    opacity: state.paletteOpacity / 100,
                  }}
                >
                  {state.showBackground && (
                    isMedia
                      ? <MediaThumbnail product={{ ...product, title: state.title }} variantSeed={state.variantSeed + state.palette + state.accent} />
                      : <ProductThumbnail product={{ ...product, title: state.title }} variantSeed={state.variantSeed + state.palette + state.accent} />
                  )}
                </div>

                {/* Overlay */}
                {state.overlay !== "none" && (
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0",
                      state.overlay === "grain" && "mt-noise opacity-30",
                      state.overlay === "scan" && "mt-scanlines opacity-25",
                      state.overlay === "leak" && "mt-light-leak",
                      state.overlay === "vignette" && "mt-vignette",
                    )}
                  />
                )}

                {/* Custom text layer (overlays the template) */}
                <div
                  className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5"
                  style={{ textAlign: state.titleAlign }}
                >
                  {state.showLogo && (
                    <div
                      className={cn(
                        "mb-auto inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold tracking-[0.3em]",
                        state.titleAlign === "center" && "mx-auto",
                        state.titleAlign === "right" && "ml-auto",
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
                        state.titleAlign === "center" && "mx-auto",
                        state.titleAlign === "right" && "ml-auto",
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
                        fontSize: state.titleSize,
                        fontWeight: state.titleWeight,
                        fontStyle: state.titleItalic ? "italic" : "normal",
                        textTransform: state.titleUppercase ? "uppercase" : "none",
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
                <span>Variant {state.variantSeed}</span>
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
                      <div className="h-10 w-full" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
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
                <div className="flex flex-wrap gap-2">
                  {["v1","v2","v3","v4","v5","v6","v7","v8"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set({ variantSeed: v })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest transition-luxe",
                        state.variantSeed === v
                          ? "border-gold bg-gradient-gold text-[hsl(var(--ink))]"
                          : "border-border bg-card text-foreground/80 hover:border-gold/40"
                      )}
                    >
                      {v}
                    </button>
                  ))}
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
              </Section>
            </>
          )}

          {/* LAYERS TAB */}
          {tab === "layers" && (
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
                <div className="grid grid-cols-2 gap-2">
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
