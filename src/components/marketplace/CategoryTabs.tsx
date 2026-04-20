import { CATEGORY_LABELS, CATEGORY_ORDER, type MarketplaceCategory } from "@/data/evenaMarketplaceCatalog";
import { cn } from "@/lib/utils";

export type CategoryFilter = "all" | MarketplaceCategory;

interface Props {
  active: CategoryFilter;
  onChange: (v: CategoryFilter) => void;
  counts: Record<string, number>;
}

export function CategoryTabs({ active, onChange, counts }: Props) {
  const tabs: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    ...CATEGORY_ORDER.map((c) => ({ value: c as CategoryFilter, label: CATEGORY_LABELS[c] })),
  ];

  return (
    <div className="sticky top-0 z-30 -mx-4 border-b border-border/60 bg-background/85 px-4 backdrop-blur">
      <div
        className="container mx-auto flex gap-2 overflow-x-auto py-3 scrollbar-hide"
        role="tablist"
        aria-label="Catégories de templates"
      >
        {tabs.map((t) => {
          const isActive = active === t.value;
          const count = counts[t.value] ?? 0;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(t.value)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] font-medium tracking-wide transition-luxe",
                isActive
                  ? "border-gold bg-gradient-gold text-ink shadow-glow"
                  : "border-border bg-card/60 text-foreground/80 hover:border-gold/40 hover:text-foreground"
              )}
            >
              {t.label}
              <span className={cn("ml-1.5 text-[10px]", isActive ? "text-ink/70" : "text-muted-foreground")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
