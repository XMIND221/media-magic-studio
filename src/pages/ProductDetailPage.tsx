import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles, Smartphone } from "lucide-react";
import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { ProductThumbnail } from "@/components/marketplace/ProductThumbnail";
import { MediaThumbnail } from "@/components/marketplace/MediaThumbnail";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useFavorites, useRecents } from "@/hooks/use-marketplace-storage";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = EVENA_MARKETPLACE_CATALOG.find((p) => p.id === id);
  const { isFav, toggle } = useFavorites();
  const { push } = useRecents();

  useEffect(() => {
    if (product) {
      push(product.id);
      document.title = `${product.title} · EVENA Marketplace`;
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => {
    if (!product) return [];
    return EVENA_MARKETPLACE_CATALOG
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
  }, [product]);

  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-center">
          <p className="font-display text-2xl text-foreground">Modèle introuvable</p>
          <Link to="/marketplace" className="mt-3 inline-block text-sm text-gold hover:underline">
            ← Retour à la marketplace
          </Link>
        </div>
      </div>
    );
  }

  const fav = isFav(product.id);

  return (
    <div className="min-h-screen bg-background">
      {/* nav */}
      <div className="border-b border-border/60 bg-gradient-noir">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Marketplace
          </Link>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground">
            {product.id.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:py-12">
        {/* hero preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border/60 shadow-luxe">
            {product.category === "media" ? (
              <MediaThumbnail product={product} />
            ) : (
              <ProductThumbnail product={product} />
            )}
          </div>
          <p className="mt-3 text-center text-[11px] tracking-[0.3em] text-muted-foreground">
            APERÇU PRINCIPAL · 10 VARIANTES STYLES À VENIR
          </p>
        </div>

        {/* info */}
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold/80">
            {product.categoryLabel.toUpperCase()} · {product.subcategory.toUpperCase()}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-foreground text-balance">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Modèle EVENA prêt à personnaliser. Adapté aux usages au Sénégal et en Afrique,
            avec un soin particulier sur la typographie et les détails dorés.
          </p>

          {/* badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.premium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-semibold tracking-wider text-ink">
                <Sparkles className="h-3 w-3" /> PREMIUM
              </span>
            )}
            {product.storyCompatible && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium tracking-wider text-foreground/80">
                <Smartphone className="h-3 w-3" /> Story compatible
              </span>
            )}
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/70 bg-card/60 px-2.5 py-0.5 text-[10px] tracking-wider text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* meta grid */}
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border text-sm">
            <Meta label="Catégorie" value={product.categoryLabel} />
            <Meta label="Sous-catégorie" value={product.subcategory} />
            <Meta label="Formats" value={product.supportedFormats.join(" · ")} />
            <Meta label="Éditable" value="Oui · Studio EVENA" />
          </dl>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold tracking-wide text-ink shadow-glow transition-luxe hover:scale-[1.02]"
            >
              Personnaliser →
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-gold/5 px-6 py-3 text-sm font-medium text-gold transition-luxe hover:bg-gold/10"
            >
              Aperçu plein écran
            </a>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={fav}
              aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm transition-luxe",
                fav
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border bg-card text-foreground/80 hover:text-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", fav && "fill-gold text-gold")} />
              {fav ? "Sauvegardé" : "Sauvegarder"}
            </button>
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground">
            Les 10 styles différents (Style 1 → Style 10) seront disponibles ici en phase 2.
          </p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-gold/80">DANS LA MÊME FAMILLE</p>
              <h2 className="font-display text-2xl text-foreground">{product.categoryLabel}</h2>
            </div>
          </div>
          <div className="hairline mt-2 mb-5" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-3">
      <dt className="text-[10px] tracking-[0.3em] text-muted-foreground">{label.toUpperCase()}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
