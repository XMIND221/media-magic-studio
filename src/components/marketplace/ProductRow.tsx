import type { MarketplaceProduct } from "@/data/evenaMarketplaceCatalog";
import { ProductCard } from "./ProductCard";

interface Props {
  title: string;
  caption?: string;
  products: MarketplaceProduct[];
}

export function ProductRow({ title, caption, products }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="container mx-auto mt-8 px-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold/80">{caption ?? "EVENA"}</p>
          <h2 className="font-display text-2xl text-foreground">{title}</h2>
        </div>
        <span className="text-[11px] text-muted-foreground">{products.length} modèles</span>
      </div>
      <div className="hairline mt-2 mb-4" />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {products.map((p) => (
          <div key={p.id} className="w-[170px] shrink-0 sm:w-[200px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
