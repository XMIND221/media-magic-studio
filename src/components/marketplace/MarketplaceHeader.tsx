import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  query: string;
  onQuery: (q: string) => void;
}

export function MarketplaceHeader({ query, onQuery }: Props) {
  return (
    <header className="relative overflow-hidden border-b border-border/50 bg-gradient-noir">
      <div className="absolute inset-0 bg-gradient-spot opacity-80" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container relative mx-auto px-4 pt-6 pb-5 sm:pt-10 sm:pb-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="EVENA accueil">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-gold text-ink font-display text-base font-bold">E</div>
            <div>
              <p className="font-display text-lg leading-none text-foreground">EVENA</p>
              <p className="text-[9px] tracking-[0.35em] text-gold/80">MARKETPLACE</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] text-muted-foreground">
            <Link
              to="/marketplace/explorer"
              className="rounded-full border border-gold/40 px-3 py-1.5 text-[10px] tracking-[0.3em] text-gold hover:bg-gold/10 transition-colors"
            >
              EXPLORER · 15 000
            </Link>
            <span className="hidden sm:inline">SÉNÉGAL</span>
            <span className="hidden sm:inline text-gold/60">·</span>
            <span className="hidden sm:inline">AFRIQUE</span>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 max-w-2xl">
          <p className="text-[10px] sm:text-[11px] tracking-[0.4em] text-gold">EVENA · TEMPLATES PREMIUM</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl leading-[1.05] text-balance text-foreground">
            La marketplace des cartes,<br />
            <span className="text-gold">passes & invitations</span> haut de gamme.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground text-pretty max-w-lg">
            150 familles · 1500+ modèles · pensés pour le Sénégal &amp; l'Afrique.
            Personnalisez en quelques minutes, partagez en story ou imprimez.
          </p>
        </div>

        {/* Search */}
        <div className="mt-6 sm:mt-8 relative max-w-xl">
          <div className="relative flex items-center rounded-full border border-border/70 bg-card/60 backdrop-blur transition focus-within:border-gold/60 focus-within:shadow-glow">
            <Search className="ml-4 h-4 w-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Mariage, Tabaski, ticket VIP, badge staff…"
              className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              aria-label="Rechercher un template"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery("")}
                className="mr-2 grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
