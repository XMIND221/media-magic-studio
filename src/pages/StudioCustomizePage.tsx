import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Download, Sparkles, Type, Palette, Image as ImageIcon } from "lucide-react";
import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { ProductThumbnail } from "@/components/marketplace/ProductThumbnail";
import { MediaThumbnail } from "@/components/marketplace/MediaThumbnail";
import { cn } from "@/lib/utils";

const FORMATS = [
  { id: "story",    label: "Story 9:16",  ratio: "9/16" },
  { id: "post",     label: "Post 4:5",    ratio: "4/5"  },
  { id: "carré",    label: "Square 1:1",  ratio: "1/1"  },
  { id: "paysage",  label: "Landscape",   ratio: "16/9" },
  { id: "portrait", label: "Portrait",    ratio: "3/4"  },
];

const PALETTES = [
  { id: "gold",   label: "Luxury Gold",   from: "hsl(43 80% 55%)", to: "hsl(38 65% 38%)" },
  { id: "noir",   label: "Pure Noir",     from: "hsl(30 14% 9%)",  to: "hsl(30 14% 4%)"  },
  { id: "neon",   label: "Neon Pop",      from: "hsl(310 100% 60%)", to: "hsl(190 100% 55%)" },
  { id: "ocean",  label: "Cinematic Blue",from: "hsl(220 70% 35%)",  to: "hsl(260 60% 25%)" },
  { id: "fire",   label: "Sunset Fire",   from: "hsl(20 90% 55%)",   to: "hsl(0 80% 40%)"   },
  { id: "mint",   label: "Editorial Mint",from: "hsl(160 50% 45%)",  to: "hsl(180 40% 20%)" },
];

const FONT_PAIRS = [
  { id: "luxe",  label: "Cormorant + Inter" },
  { id: "bold",  label: "Display Bold + Sans" },
  { id: "edit",  label: "Editorial Serif" },
  { id: "tech",  label: "Modern Mono + Sans" },
];

export default function StudioCustomizePage() {
  const { id } = useParams<{ id: string }>();
  const product = EVENA_MARKETPLACE_CATALOG.find((p) => p.id === id);

  const [title, setTitle] = useState(product?.title ?? "Your Title");
  const [subtitle, setSubtitle] = useState("EVENA · Premium");
  const [format, setFormat] = useState(product?.supportedFormats?.[0] ?? "story");
  const [palette, setPalette] = useState(PALETTES[0].id);
  const [font, setFont] = useState(FONT_PAIRS[0].id);
  const [variantSeed, setVariantSeed] = useState("v1");

  useEffect(() => {
    if (product) document.title = `Studio · ${product.title} — EVENA`;
  }, [product]);

  const activePalette = useMemo(() => PALETTES.find(p => p.id === palette)!, [palette]);

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
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-xs font-semibold tracking-wide text-[hsl(var(--ink))] shadow-glow transition-luxe hover:scale-[1.02]"
          >
            <Download className="h-3.5 w-3.5" /> Exporter
          </button>
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
        {/* Preview */}
        <section className="order-1 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl border border-border/60 bg-gradient-noir p-4 sm:p-8">
            <div className="mx-auto" style={{ maxWidth: 420 }}>
              <div
                key={`${format}-${palette}-${variantSeed}`}
                className="overflow-hidden rounded-2xl border border-border/60 shadow-luxe animate-fade-up"
                style={{
                  aspectRatio: FORMATS.find(f => f.id === format)?.ratio ?? "4/5",
                  background: `linear-gradient(135deg, ${activePalette.from}, ${activePalette.to})`,
                }}
              >
                {isMedia
                  ? <MediaThumbnail product={{ ...product, title }} variantSeed={variantSeed + palette} />
                  : <ProductThumbnail product={{ ...product, title }} variantSeed={variantSeed + palette} />}
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="uppercase tracking-[0.3em]">{format}</span>
                <span>Variant {variantSeed}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Customization panel */}
        <aside className="order-2 space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Customize</p>
            <h1 className="font-display text-2xl text-foreground">{product.title}</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {product.categoryLabel} · {product.subcategory}
            </p>
          </div>

          <Section icon={<Type className="h-3.5 w-3.5" />} label="Texte">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-luxe focus:border-gold/50"
            />
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Sous-titre"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-luxe focus:border-gold/50"
            />
          </Section>

          <Section icon={<ImageIcon className="h-3.5 w-3.5" />} label="Format">
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs transition-luxe",
                    format === f.id
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
                  onClick={() => setPalette(p.id)}
                  className={cn(
                    "group flex flex-col items-stretch overflow-hidden rounded-lg border text-[10px] transition-luxe",
                    palette === p.id ? "border-gold ring-1 ring-gold/40" : "border-border hover:border-gold/40"
                  )}
                >
                  <div
                    className="h-10 w-full"
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  />
                  <span className="bg-card px-1.5 py-1 text-foreground/80">
                    {palette === p.id && <Check className="mr-1 inline h-2.5 w-2.5 text-gold" />}
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <Section icon={<Type className="h-3.5 w-3.5" />} label="Typographie">
            <div className="grid gap-2">
              {FONT_PAIRS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFont(f.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs transition-luxe",
                    font === f.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border bg-card text-foreground/80 hover:border-gold/40"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Section>

          <Section icon={<Sparkles className="h-3.5 w-3.5" />} label="Variantes">
            <div className="flex flex-wrap gap-2">
              {["v1","v2","v3","v4","v5","v6"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariantSeed(v)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest transition-luxe",
                    variantSeed === v
                      ? "border-gold bg-gradient-gold text-[hsl(var(--ink))]"
                      : "border-border bg-card text-foreground/80 hover:border-gold/40"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </Section>

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

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <p className="mb-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.35em] text-gold/80">
        {icon} {label}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
