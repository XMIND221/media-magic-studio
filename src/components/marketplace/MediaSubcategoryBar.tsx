import {
  Instagram, Youtube, Megaphone, Briefcase, CalendarDays,
  Music, Newspaper, ShoppingBag, Quote, Sparkles, LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MEDIA_SUBCATEGORIES = [
  "Social Media",
  "YouTube / Video",
  "Promo / Ads",
  "Business Media",
  "Event Media",
  "Music / Artist",
  "News / Info",
  "E-commerce",
  "Creator Content",
  "Premium Visual",
] as const;

export type MediaSubcategory = (typeof MEDIA_SUBCATEGORIES)[number] | "all";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "all":               LayoutGrid,
  "Social Media":      Instagram,
  "YouTube / Video":   Youtube,
  "Promo / Ads":       Megaphone,
  "Business Media":    Briefcase,
  "Event Media":       CalendarDays,
  "Music / Artist":    Music,
  "News / Info":       Newspaper,
  "E-commerce":        ShoppingBag,
  "Creator Content":   Quote,
  "Premium Visual":    Sparkles,
};

const SHORT: Record<string, string> = {
  "Social Media":    "Social",
  "YouTube / Video": "YouTube",
  "Promo / Ads":     "Promo",
  "Business Media":  "Business",
  "Event Media":     "Event",
  "Music / Artist":  "Music",
  "News / Info":     "News",
  "E-commerce":      "Shop",
  "Creator Content": "Creator",
  "Premium Visual":  "Premium",
};

interface Props {
  value: MediaSubcategory;
  onChange: (v: MediaSubcategory) => void;
  counts: Record<string, number>;
}

export function MediaSubcategoryBar({ value, onChange, counts }: Props) {
  const items: { id: MediaSubcategory; label: string }[] = [
    { id: "all", label: "Tous" },
    ...MEDIA_SUBCATEGORIES.map((s) => ({ id: s, label: SHORT[s] ?? s })),
  ];

  return (
    <div className="container mx-auto mt-3 px-4 animate-fade-up">
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 p-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="shrink-0 pl-2 pr-1 text-[9px] uppercase tracking-[0.4em] text-gold/80">
            Media
          </span>
          {items.map((it) => {
            const Icon = ICONS[it.id] ?? LayoutGrid;
            const isActive = value === it.id;
            const count = counts[it.id] ?? 0;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onChange(it.id)}
                aria-pressed={isActive}
                className={cn(
                  "group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-1.5 text-[11px] font-medium transition-luxe",
                  isActive
                    ? "border-gold bg-gradient-gold text-[hsl(var(--ink))] shadow-glow"
                    : "border-border/70 bg-card/60 text-foreground/80 hover:border-gold/40 hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {it.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[9px]",
                    isActive ? "bg-[hsl(var(--ink))/.15] text-[hsl(var(--ink))]" : "bg-foreground/5 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
