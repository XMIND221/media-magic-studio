import { Link } from "react-router-dom";
import { Heart, Sparkles, Smartphone } from "lucide-react";
import type { MarketplaceProduct } from "@/data/evenaMarketplaceCatalog";
import { ProductThumbnail } from "./ProductThumbnail";
import { MediaThumbnail } from "./MediaThumbnail";
import { useFavorites } from "@/hooks/use-marketplace-storage";
import { cn } from "@/lib/utils";

interface Props {
  product: MarketplaceProduct;
}

export function ProductCard({ product }: Props) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(product.id);

  return (
    <Link
      to={`/marketplace/${product.id}`}
      className="group relative block focus:outline-none"
      aria-label={`Voir ${product.title}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-luxe group-hover:-translate-y-1 group-hover:shadow-luxe group-focus-visible:ring-2 group-focus-visible:ring-gold">
        {/* gold ring on hover */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-gold/0 transition-luxe group-hover:ring-gold/40" />

        {/* badges top-left */}
        <div className="absolute left-2 top-2 z-10 flex gap-1">
          {product.premium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-2 py-0.5 text-[9px] font-semibold tracking-wider text-ink shadow-sm">
              <Sparkles className="h-2.5 w-2.5" /> PREMIUM
            </span>
          )}
          {product.storyCompatible && (
            <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[9px] font-medium tracking-wider text-foreground/80 backdrop-blur">
              <Smartphone className="h-2.5 w-2.5" /> STORY
            </span>
          )}
        </div>

        {/* favorite */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-label={fav ? `Retirer ${product.title} des favoris` : `Ajouter ${product.title} aux favoris`}
          aria-pressed={fav}
          className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-background/70 text-foreground/80 backdrop-blur transition hover:bg-background hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Heart className={cn("h-3.5 w-3.5", fav && "fill-gold text-gold")} />
        </button>

        <ProductThumbnail product={product} />
      </div>

      {/* meta */}
      <div className="mt-2 px-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80">{product.subcategory}</p>
        <h3 className="mt-0.5 line-clamp-2 font-display text-[15px] leading-tight text-foreground">
          {product.title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{product.categoryLabel}</span>
          <span className="text-gold/80">Personnaliser →</span>
        </div>
      </div>
    </Link>
  );
}
