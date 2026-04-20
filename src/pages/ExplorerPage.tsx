import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Shuffle } from "lucide-react";
import {
  composeModel,
  stratifiedSample,
  TOTAL_MODELS,
  VARIANTS_PER_PRODUCT,
  ACCENT_HUES,
  LAYOUTS,
  CATEGORY_RANGES,
  type ModelSpec,
  type Family,
} from "@/evena/models";
import { ExplorerModelCard } from "@/components/marketplace/ExplorerModelCard";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 60;
const SAMPLE_SIZE = 600; // échantillon stratifié initial

// Toutes les familles, dérivées des plages.
const ALL_FAMILIES: Family[] = Array.from(
  new Set(CATEGORY_RANGES.flatMap((r) => r.families))
).sort() as Family[];

export default function ExplorerPage() {
  const [variantOffset, setVariantOffset] = useState(0);
  const [familyFilter, setFamilyFilter] = useState<string>("all");
  const [accentFilter, setAccentFilter] = useState<string>("all");
  const [layoutFilter, setLayoutFilter] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Échantillon stratifié — recalculé seulement quand on shuffle.
  const sample = useMemo<ModelSpec[]>(
    () => stratifiedSample(SAMPLE_SIZE, variantOffset),
    [variantOffset]
  );

  const filtered = useMemo(() => {
    return sample.filter((m) => {
      if (familyFilter !== "all" && m.family !== familyFilter) return false;
      if (accentFilter !== "all" && m.accentHue !== accentFilter) return false;
      if (layoutFilter !== "all" && m.layout !== layoutFilter) return false;
      return true;
    });
  }, [sample, familyFilter, accentFilter, layoutFilter]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [familyFilter, accentFilter, layoutFilter, variantOffset]);

  const shuffle = () => {
    setVariantOffset((o) => (o + 17) % VARIANTS_PER_PRODUCT);
  };

  const reset = () => {
    setFamilyFilter("all");
    setAccentFilter("all");
    setLayoutFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Marketplace
            </Link>
            <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
              {TOTAL_MODELS.toLocaleString("fr-FR")} modèles
            </Badge>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl md:text-3xl text-foreground">
              Explorer le moteur EVENA
            </h1>
            <p className="text-sm text-muted-foreground">
              Échantillon stratifié de {SAMPLE_SIZE} modèles · 150 familles × 100 variantes procédurales.
            </p>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={familyFilter} onValueChange={setFamilyFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[160px]">
                <SelectValue placeholder="Famille" />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                <SelectItem value="all">Toutes familles</SelectItem>
                {ALL_FAMILIES.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={accentFilter} onValueChange={setAccentFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[140px]">
                <SelectValue placeholder="Palette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes palettes</SelectItem>
                {ACCENT_HUES.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={layoutFilter} onValueChange={setLayoutFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[140px]">
                <SelectValue placeholder="Layout" />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                <SelectItem value="all">Tous layouts</SelectItem>
                {LAYOUTS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={shuffle}
              className="h-9 gap-1.5"
              aria-label="Re-piocher un autre échantillon stratifié"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Shuffle
            </Button>

            {(familyFilter !== "all" || accentFilter !== "all" || layoutFilter !== "all") && (
              <Button variant="ghost" size="sm" onClick={reset} className="h-9 text-xs">
                Réinitialiser
              </Button>
            )}

            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </header>

      {/* Grille */}
      <main className="container mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Aucun modèle pour ces filtres. Essaie de re-piocher ou d'élargir.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filtered.slice(0, visible).map((m) => (
                <ExplorerModelCard key={m.modelKey} model={m} />
              ))}
            </div>

            {visible < filtered.length && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  variant="outline"
                  className="gap-2"
                >
                  Charger plus ({filtered.length - visible} restants)
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
