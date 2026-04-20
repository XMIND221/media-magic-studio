import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EVENA_MARKETPLACE_CATALOG } from "@/data/evenaMarketplaceCatalog";
import { ProductThumbnail } from "@/components/marketplace/ProductThumbnail";

const HERO_PICKS = [1, 49, 61, 91, 114, 131].map((i) =>
  EVENA_MARKETPLACE_CATALOG.find((p) => p.index === i)!
);

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-gold text-ink font-display text-base font-bold">E</div>
          <div>
            <p className="font-display text-lg leading-none text-foreground">EVENA</p>
            <p className="text-[9px] tracking-[0.35em] text-gold/80">PREMIUM TEMPLATES</p>
          </div>
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 text-sm text-gold transition-luxe hover:bg-gold/10"
        >
          Marketplace <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-spot" aria-hidden />
        <div className="container relative mx-auto grid gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-[10px] sm:text-[11px] tracking-[0.5em] text-gold">EVENA · ÉDITION 2025</p>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[1.02] text-balance text-foreground">
              Cartes, passes &amp; invitations <span className="text-gold">d'exception.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
              150 familles de templates premium. Pensées pour le Sénégal et l'Afrique.
              Mariage, Tabaski, gala, billetterie, badges, business — tout y est.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold tracking-wide text-ink shadow-glow transition-luxe hover:scale-[1.02]"
              >
                Explorer la marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#preview"
                className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm text-foreground/80 transition-luxe hover:border-gold/40 hover:text-foreground"
              >
                Aperçu rapide
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-[11px] tracking-[0.3em] text-muted-foreground">
              <div>
                <div className="font-display text-xl text-gold">192</div>
                <div>FAMILLES</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="font-display text-xl text-gold">2000+</div>
                <div>MODÈLES</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="font-display text-xl text-gold">12</div>
                <div>CATÉGORIES</div>
              </div>
            </div>
          </div>

          {/* visual mosaic */}
          <div id="preview" className="grid grid-cols-3 gap-3">
            {HERO_PICKS.map((p, i) => (
              <Link
                key={p.id}
                to={`/marketplace/${p.id}`}
                className="overflow-hidden rounded-2xl border border-border/60 shadow-card transition-luxe hover:-translate-y-1 hover:shadow-luxe"
                style={{ transform: `translateY(${(i % 2) * 18}px)` }}
                aria-label={p.title}
              >
                <ProductThumbnail product={p} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-8 text-center">
          <p className="font-display text-lg text-gold">EVENA</p>
          <p className="text-[11px] tracking-[0.3em] text-muted-foreground">
            DAKAR · ABIDJAN · LAGOS · CASABLANCA
          </p>
        </div>
      </footer>
    </div>
  );
}
