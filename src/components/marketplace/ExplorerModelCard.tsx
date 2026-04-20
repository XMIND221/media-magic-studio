import { Link } from "react-router-dom";
import type { Family, ModelSpec } from "@/evena/models";
import { ProductThumbnail } from "@/components/marketplace/ProductThumbnail";
import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { Badge } from "@/components/ui/badge";

interface Props {
  model: ModelSpec;
}

type Archetype =
  | "invitation-portrait" | "save-the-date" | "ticket-horizontal" | "ticket-mini"
  | "badge-lanyard" | "badge-round" | "pass-noir-or" | "business-card"
  | "menu-editorial" | "ceremony-frame" | "boarding-pass" | "promo-poster"
  | "loyalty-card" | "festival-poster";

const FAMILY_TO_ARCHETYPE: Record<Family, Archetype> = {
  "invitation-portrait": "invitation-portrait",
  "invitation-editorial": "menu-editorial",
  "invitation-frame": "ceremony-frame",
  "save-the-date": "save-the-date",
  "ceremony-frame": "ceremony-frame",
  "festival-poster": "festival-poster",
  "ticket-horizontal": "ticket-horizontal",
  "ticket-mini": "ticket-mini",
  "ticket-stub": "ticket-horizontal",
  "boarding-pass": "boarding-pass",
  "badge-lanyard": "badge-lanyard",
  "badge-round": "badge-round",
  "badge-square": "badge-lanyard",
  "pass-noir-or": "pass-noir-or",
  "pass-foil": "pass-noir-or",
  "business-card": "business-card",
  "business-vertical": "business-card",
  "menu-editorial": "menu-editorial",
  "menu-bistro": "menu-editorial",
  "edu-id": "business-card",
  "edu-diploma": "ceremony-frame",
  "religion-arabesque": "ceremony-frame",
  "religion-tabaski": "ceremony-frame",
  "religion-magal": "ceremony-frame",
  "sport-ticket": "ticket-horizontal",
  "sport-pass": "pass-noir-or",
  "travel-pass": "pass-noir-or",
  "travel-ticket": "ticket-horizontal",
  "promo-poster": "promo-poster",
  "loyalty-card": "loyalty-card",
  "gift-card": "loyalty-card",
  "coupon-strip": "ticket-mini",
};

function motifToOrnament(motif: string): "kente" | "bogolan" | "geometric" | "wave" | "dots" | "starburst" {
  if (motif.startsWith("kente")) return "kente";
  if (motif.startsWith("bogolan")) return "bogolan";
  if (motif.startsWith("wave")) return "wave";
  if (motif.includes("dot")) return "dots";
  if (motif.includes("constellation") || motif.includes("seal") || motif.includes("blason")) return "starburst";
  return "geometric";
}

// Familles qui supportent une zone image (affiche / photo).
const IMAGE_SLOT_FAMILIES = new Set<Family>([
  "festival-poster",
  "promo-poster",
  "save-the-date",
  "ticket-horizontal",
  "ticket-stub",
  "sport-ticket",
  "travel-ticket",
  "invitation-editorial",
]);

function imageSlotMode(model: ModelSpec): "placeholder" | "demo" | "none" {
  if (!IMAGE_SLOT_FAMILIES.has(model.family)) return "none";
  // Alterne placeholder/démo selon le seed → certaines variantes "édition", d'autres "rendu fini".
  return model.variantIndex % 2 === 0 ? "demo" : "placeholder";
}

/**
 * Carte de modèle d'explorer.
 * Force archetype + palette + ornement + zone image depuis le ModelSpec
 * pour révéler la diversité du moteur EVENA.
 */
export function ExplorerModelCard({ model }: Props) {
  const baseProduct = EVENA_MARKETPLACE_CATALOG[model.productIndex - 1];
  const virtualProduct = { ...baseProduct, designSeed: model.designSeed };
  const archetype = FAMILY_TO_ARCHETYPE[model.family];
  const ornament = motifToOrnament(model.motif);
  const imageSlot = imageSlotMode(model);

  return (
    <Link
      to={`/marketplace/${model.productId}`}
      className="group block rounded-xl border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.4)]"
      aria-label={`${model.productTitle} – variante ${model.variantIndex + 1}`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-background flex items-center justify-center p-2">
        <ProductThumbnail
          product={virtualProduct}
          overrides={{
            archetype,
            ornament,
            imageSlot,
            palette: {
              bg: model.palette.bg,
              ink: model.palette.ink,
              gold: model.palette.gold,
              accent: model.palette.accent,
            },
          }}
        />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight line-clamp-1 text-foreground">
            {model.productTitle}
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            v{String(model.variantIndex + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
            {model.family}
          </Badge>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {model.layout}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full border border-border/60"
              style={{ backgroundColor: model.palette.gold }}
              aria-hidden
            />
            {model.accentHue}
          </span>
          <span>·</span>
          <span className="truncate">{model.motif}</span>
        </div>
      </div>
    </Link>
  );
}
