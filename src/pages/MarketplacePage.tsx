import { useEffect, useMemo, useState } from "react";
import { EVENA_MARKETPLACE_CATALOG, type MarketplaceProduct } from "@/data/evenaMarketplaceCatalog";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { CategoryTabs, type CategoryFilter } from "@/components/marketplace/CategoryTabs";
import { FiltersBar, type FilterState } from "@/components/marketplace/FiltersBar";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ProductRow } from "@/components/marketplace/ProductRow";
import { useFavorites, useRecents } from "@/hooks/use-marketplace-storage";

const PAGE_SIZE = 24;

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [filters, setFilters] = useState<FilterState>({ premiumOnly: false, storyOnly: false, format: "all" });
  const [visible, setVisible] = useState(PAGE_SIZE);

  const { favs } = useFavorites();
  const { recents } = useRecents();

  // Reset pagination when filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, category, filters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENA_MARKETPLACE_CATALOG.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (filters.premiumOnly && !p.premium) return false;
      if (filters.storyOnly && !p.storyCompatible) return false;
      if (filters.format !== "all" && !p.supportedFormats.includes(filters.format)) return false;
      if (q) {
        const hay = `${p.title} ${p.subcategory} ${p.categoryLabel} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, category, filters]);

  // Counts per category (respecting filters/search but not category itself)
  const counts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = EVENA_MARKETPLACE_CATALOG.filter((p) => {
      if (filters.premiumOnly && !p.premium) return false;
      if (filters.storyOnly && !p.storyCompatible) return false;
      if (filters.format !== "all" && !p.supportedFormats.includes(filters.format)) return false;
      if (q) {
        const hay = `${p.title} ${p.subcategory} ${p.categoryLabel} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const out: Record<string, number> = { all: base.length };
    for (const p of base) out[p.category] = (out[p.category] ?? 0) + 1;
    return out;
  }, [query, filters]);

  const trending = useMemo(
    () => EVENA_MARKETPLACE_CATALOG.filter((p) => p.premium && p.storyCompatible).slice(0, 12),
    []
  );
  const newest = useMemo(() => [...EVENA_MARKETPLACE_CATALOG].reverse().slice(0, 12), []);
  const recommended = useMemo(() => {
    // simple heuristic: mix one per category
    const seen = new Set<string>();
    const out: MarketplaceProduct[] = [];
    for (const p of EVENA_MARKETPLACE_CATALOG) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        out.push(p);
      }
    }
    return out;
  }, []);

  const favoriteProducts = useMemo(
    () => favs.map((id) => EVENA_MARKETPLACE_CATALOG.find((p) => p.id === id)).filter(Boolean) as MarketplaceProduct[],
    [favs]
  );
  const recentProducts = useMemo(
    () => recents.map((id) => EVENA_MARKETPLACE_CATALOG.find((p) => p.id === id)).filter(Boolean) as MarketplaceProduct[],
    [recents]
  );

  const showRows = !query && category === "all" && !filters.premiumOnly && !filters.storyOnly && filters.format === "all";
  const shown = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader query={query} onQuery={setQuery} />

      <CategoryTabs active={category} onChange={setCategory} counts={counts} />
      <FiltersBar value={filters} onChange={setFilters} />

      {showRows && (
        <>
          <ProductRow title="Tendance cette semaine" caption="POPULAIRE" products={trending} />
          {favoriteProducts.length > 0 && (
            <ProductRow title="Vos favoris" caption="SAUVEGARDÉS" products={favoriteProducts} />
          )}
          {recentProducts.length > 0 && (
            <ProductRow title="Récemment consultés" caption="HISTORIQUE" products={recentProducts} />
          )}
          <ProductRow title="Recommandé pour vous" caption="POUR VOUS" products={recommended} />
          <ProductRow title="Nouveautés" caption="NEW" products={newest} />
        </>
      )}

      {/* Main grid */}
      <section className="container mx-auto mt-10 px-4 pb-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold/80">CATALOGUE</p>
            <h2 className="font-display text-2xl text-foreground">
              {category === "all" ? "Tous les modèles" : `Famille — ${shown[0]?.categoryLabel ?? ""}`}
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="hairline mt-2 mb-5" />

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-10 text-center">
            <p className="font-display text-xl text-foreground">Aucun modèle trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">Essayez d'autres mots-clés ou changez de catégorie.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {shown.map((p) => (
                <div key={p.id} className="animate-fade-up">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-gold/40 bg-gold/5 px-6 py-2.5 text-sm font-medium tracking-wide text-gold transition-luxe hover:bg-gradient-gold hover:text-ink hover:shadow-glow"
                >
                  Charger plus ({filtered.length - visible} restants)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="border-t border-border/60 bg-gradient-noir">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-display text-lg text-gold">EVENA</p>
          <p className="mt-1 text-[11px] tracking-[0.3em] text-muted-foreground">
            192 FAMILLES · 2000+ MODÈLES · MEDIA · ÉVÉNEMENTIEL · BUSINESS
          </p>
        </div>
      </footer>
    </div>
  );
}
