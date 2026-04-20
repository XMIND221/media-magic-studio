import { useMemo } from "react";
import type { MarketplaceProduct } from "@/data/evenaMarketplaceCatalog";
import { hashSeed, mulberry32, range } from "@/lib/seed";
import { cn } from "@/lib/utils";

/**
 * MediaThumbnail — animated, modern previews for the Media category.
 * Distinct visual archetypes per subcategory; never reuses ProductThumbnail.
 * All colors come from CSS tokens; gold accents are baked into the design system.
 */

type MediaArchetype =
  | "social-story"
  | "social-grid"
  | "yt-thumbnail"
  | "yt-banner"
  | "yt-podcast"
  | "video-frame"
  | "promo-burst"
  | "business-tile"
  | "event-spotlight"
  | "music-cover"
  | "news-ticker"
  | "ecom-card"
  | "creator-quote"
  | "premium-cinematic"
  | "premium-neon"
  | "premium-glass"
  | "premium-gold";

function archetypeFor(p: MarketplaceProduct): MediaArchetype {
  const t = p.title.toLowerCase();
  const s = p.subcategory;
  if (s === "Premium Visual") {
    if (t.includes("cinematic")) return "premium-cinematic";
    if (t.includes("neon")) return "premium-neon";
    if (t.includes("glass")) return "premium-glass";
    return "premium-gold";
  }
  if (s === "Music / Artist") return "music-cover";
  if (s === "News / Info") return "news-ticker";
  if (s === "E-commerce") return "ecom-card";
  if (s === "Creator Content") return "creator-quote";
  if (s === "Promo / Ads") return "promo-burst";
  if (s === "Business Media") return "business-tile";
  if (s === "Event Media") return "event-spotlight";
  if (s === "YouTube / Video") {
    if (t.includes("thumbnail")) return "yt-thumbnail";
    if (t.includes("banner")) return "yt-banner";
    if (t.includes("podcast")) return "yt-podcast";
    return "video-frame";
  }
  // Social Media
  return p.index % 2 === 0 ? "social-grid" : "social-story";
}

interface Props {
  product: MarketplaceProduct;
  className?: string;
  variantSeed?: string;
}

export function MediaThumbnail({ product, className, variantSeed }: Props) {
  const { archetype, params } = useMemo(() => {
    const rng = mulberry32(hashSeed(product.designSeed + (variantSeed ?? "")));
    return {
      archetype: archetypeFor(product),
      params: {
        hue: range(rng, 0, 360),
        rot: range(rng, -6, 6),
        a: rng(),
        b: rng(),
        c: rng(),
      },
    };
  }, [product, variantSeed]);

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-[inherit] bg-[hsl(var(--ink))]",
        className
      )}
      style={{ ['--mt-hue' as string]: `${params.hue}` }}
    >
      {renderArchetype(archetype, product, params)}
      {/* shared shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 mt-shimmer" aria-hidden />
    </div>
  );
}

/* --------------------- Archetypes --------------------- */

type P = { hue: number; rot: number; a: number; b: number; c: number };

function renderArchetype(a: MediaArchetype, p: MarketplaceProduct, params: P) {
  switch (a) {
    case "social-story":     return <SocialStory product={p} params={params} />;
    case "social-grid":      return <SocialGrid product={p} params={params} />;
    case "yt-thumbnail":     return <YouTubeThumb product={p} params={params} />;
    case "yt-banner":        return <YouTubeBanner product={p} params={params} />;
    case "yt-podcast":       return <PodcastCover product={p} params={params} />;
    case "video-frame":      return <VideoFrame product={p} params={params} />;
    case "promo-burst":      return <PromoBurst product={p} params={params} />;
    case "business-tile":    return <BusinessTile product={p} params={params} />;
    case "event-spotlight":  return <EventSpotlight product={p} params={params} />;
    case "music-cover":      return <MusicCover product={p} params={params} />;
    case "news-ticker":      return <NewsTicker product={p} params={params} />;
    case "ecom-card":        return <EcomCard product={p} params={params} />;
    case "creator-quote":    return <CreatorQuote product={p} params={params} />;
    case "premium-cinematic":return <PremiumCinematic product={p} params={params} />;
    case "premium-neon":     return <PremiumNeon product={p} params={params} />;
    case "premium-glass":    return <PremiumGlass product={p} params={params} />;
    case "premium-gold":     return <PremiumGold product={p} params={params} />;
  }
}

interface AProps { product: MarketplaceProduct; params: P }

function Mono({ children }: { children: React.ReactNode }) {
  return <div className="font-display text-[hsl(var(--gold))]">{children}</div>;
}

/* === Social === */
function SocialStory({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-aurora" />
      <div className="absolute inset-x-3 top-3 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gradient-gold" />
        <div className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full w-2/3 bg-white/80 mt-progress" />
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-6 text-white">
        <p className="text-[9px] uppercase tracking-[0.3em] opacity-80">@evena.studio</p>
        <h4 className="font-display text-2xl leading-tight mt-rise">{product.title}</h4>
      </div>
      <div className="absolute right-3 bottom-3 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur">Story</div>
    </>
  );
}

function SocialGrid({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] bg-[hsl(var(--ink))]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="mt-tile" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[hsl(var(--ink))/.75] p-2.5 backdrop-blur">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Feed Post</p>
        <h4 className="font-display text-base leading-tight text-white">{product.title}</h4>
      </div>
    </>
  );
}

/* === YouTube === */
function YouTubeThumb({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-cinema" />
      <div className="absolute inset-0 mt-noise opacity-40" />
      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-sm bg-red-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
        ● LIVE
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/95 shadow-glow mt-pulse">
          <div className="ml-1 h-0 w-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-black" />
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3">
        <h4 className="font-display text-xl font-bold leading-tight text-white drop-shadow-lg">
          {product.title.toUpperCase()}
        </h4>
        <p className="mt-0.5 text-[10px] tracking-wide text-white/70">EVENA · 4K · 12:34</p>
      </div>
    </>
  );
}

function YouTubeBanner({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-channel" />
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-white">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[hsl(var(--gold))]">Channel Art</p>
        <h4 className="mt-1 font-display text-3xl leading-none">EVENA</h4>
        <div className="mt-2 h-px w-12 bg-[hsl(var(--gold))]" />
        <p className="mt-2 text-[10px] tracking-widest text-white/70">{product.title.toUpperCase()}</p>
      </div>
      <div className="absolute right-3 bottom-3 flex gap-1.5">
        {[0,1,2].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))/.7] mt-blink" style={{animationDelay:`${i*200}ms`}}/>)}
      </div>
    </>
  );
}

function PodcastCover({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-podcast" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative grid h-24 w-24 place-items-center rounded-full border border-[hsl(var(--gold))/.5]">
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} className="absolute inset-0 mt-ring" style={{ animationDelay: `${i*120}ms`}}/>
          ))}
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-[hsl(var(--ink))] text-lg">🎙</div>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-center text-white">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[hsl(var(--gold))]">Episode 01</p>
        <h4 className="mt-0.5 font-display text-lg leading-tight">{product.title}</h4>
      </div>
    </>
  );
}

function VideoFrame({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-cinema" />
      <div className="absolute inset-0 mt-scanlines opacity-30" />
      {/* film bars */}
      <div className="absolute inset-x-0 top-0 h-6 bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-black" />
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-white">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[hsl(var(--gold))]">Motion</p>
        <h4 className="mt-1 font-display text-2xl leading-tight">{product.title}</h4>
        <div className="mt-3 h-1 w-24 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full w-1/2 bg-[hsl(var(--gold))] mt-progress" />
        </div>
      </div>
    </>
  );
}

/* === Promo === */
function PromoBurst({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-promo" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[hsl(var(--gold))/.25] mt-pulse" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 mt-pulse" style={{ animationDelay: "300ms" }} />
      <div className="absolute inset-x-4 top-4">
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur">
          {product.title.includes("Flash") ? "FLASH" : "PROMO"}
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <div className="font-display text-5xl leading-none mt-rise">-50<span className="text-2xl align-top">%</span></div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--gold))]">{product.title}</p>
      </div>
    </>
  );
}

/* === Business === */
function BusinessTile({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-noir" />
      <div className="absolute inset-0 mt-grid-soft opacity-50" />
      <div className="absolute inset-x-4 top-4 flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-gradient-gold grid place-items-center text-[hsl(var(--ink))] font-display text-sm">E</div>
        <p className="text-[9px] uppercase tracking-[0.4em] text-[hsl(var(--gold))]">EVENA · BRAND</p>
      </div>
      <div className="absolute inset-x-4 bottom-4">
        <h4 className="font-display text-xl leading-tight text-white">{product.title}</h4>
        <p className="mt-1 text-[10px] text-white/60">Crafted with care by the team.</p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold))/.5] px-2.5 py-1 text-[9px] uppercase tracking-widest text-[hsl(var(--gold))]">
          Read more →
        </div>
      </div>
    </>
  );
}

/* === Event === */
function EventSpotlight({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-spot-dark" />
      <div className="absolute -inset-x-4 top-0 h-1/2 mt-spotlight" />
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[hsl(var(--gold))]">Coming Soon</p>
        <h4 className="font-display text-2xl leading-tight mt-rise">{product.title}</h4>
        <div className="mt-3 flex gap-2 text-center text-white">
          {["12","04","59"].map((v,i)=>(
            <div key={i} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 backdrop-blur">
              <div className="font-display text-base leading-none">{v}</div>
              <div className="text-[8px] uppercase tracking-widest text-white/50">{["d","h","m"][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* === Music === */
function MusicCover({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-music" />
      <div className="absolute inset-0 mt-vinyl" />
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[hsl(var(--gold))]">Now Playing</p>
        <h4 className="font-display text-xl leading-tight">{product.title}</h4>
        <div className="mt-2 flex items-end gap-0.5 h-5">
          {Array.from({length:18}).map((_,i)=>(
            <div key={i} className="w-0.5 bg-[hsl(var(--gold))] mt-eq" style={{animationDelay:`${i*60}ms`}}/>
          ))}
        </div>
      </div>
    </>
  );
}

/* === News === */
function NewsTicker({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 bg-[hsl(var(--ink))]" />
      <div className="absolute inset-x-0 top-0 h-1 mt-progress-bar" />
      <div className="absolute inset-x-3 top-4 flex items-center gap-2">
        <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-white">BREAKING</span>
        <span className="text-[9px] uppercase tracking-widest text-white/60">EVENA NEWS</span>
      </div>
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-white">
        <h4 className="font-display text-xl leading-tight">{product.title}</h4>
        <div className="mt-2 h-px w-10 bg-[hsl(var(--gold))]" />
        <p className="mt-2 text-[10px] text-white/70">Live coverage · 21h00 GMT</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-[hsl(var(--gold))] py-1">
        <div className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--ink))] mt-marquee">
          · UPDATE · EVENA · MEDIA · BREAKING · NOW · LIVE · UPDATE · EVENA · MEDIA · BREAKING · NOW · LIVE
        </div>
      </div>
    </>
  );
}

/* === E-commerce === */
function EcomCard({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--surface-2))] to-[hsl(var(--ink))]" />
      <div className="absolute inset-x-3 top-3 bottom-20 rounded-xl bg-gradient-to-br from-white/10 to-white/5 mt-tile" />
      <div className="absolute right-4 top-4 rounded-full bg-gradient-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--ink))]">
        NEW
      </div>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Shop</p>
        <h4 className="font-display text-base leading-tight">{product.title}</h4>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg">19 900 F</span>
          <span className="text-[10px] line-through text-white/40">29 000 F</span>
        </div>
      </div>
    </>
  );
}

/* === Creator === */
function CreatorQuote({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-creator" />
      <div className="absolute left-3 top-3 font-display text-5xl leading-none text-[hsl(var(--gold))/.5]">"</div>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 text-white">
        <p className="font-display text-base leading-snug">
          {product.title === "Quote Card" ? "Build it slow. Build it well." : product.title}
        </p>
      </div>
      <div className="absolute inset-x-4 bottom-3 flex items-center gap-2 text-white">
        <div className="h-6 w-6 rounded-full bg-gradient-gold" />
        <div>
          <p className="text-[10px] font-medium leading-none">@evena.studio</p>
          <p className="text-[8px] uppercase tracking-widest text-white/50">Creator</p>
        </div>
      </div>
    </>
  );
}

/* === Premium === */
function PremiumCinematic({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-cinema-deep" />
      <div className="absolute inset-x-0 top-0 h-8 bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-black" />
      <div className="absolute inset-0 mt-light-leak" />
      <div className="absolute inset-x-4 bottom-12 text-white">
        <p className="text-[9px] uppercase tracking-[0.5em] text-[hsl(var(--gold))]">Cinematic</p>
        <h4 className="font-display text-2xl leading-tight tracking-tight">{product.title}</h4>
      </div>
    </>
  );
}

function PremiumNeon({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 mt-neon-bg" />
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center">
        <p className="text-[9px] uppercase tracking-[0.5em] text-pink-300/80">Neon</p>
        <h4 className="mt-2 font-display text-3xl leading-none mt-neon-text">
          {product.title.split(" ")[0].toUpperCase()}
        </h4>
        <div className="mt-3 h-px w-20 mx-auto mt-neon-line" />
      </div>
    </>
  );
}

function PremiumGlass({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 mt-gradient-glass" />
      <div className="absolute inset-0 mt-orbs" />
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md shadow-glow">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/70">Glass</p>
          <h4 className="mt-1 font-display text-lg leading-tight text-white">{product.title}</h4>
          <div className="mt-2 h-px bg-white/20" />
          <p className="mt-2 text-[10px] text-white/60">Frosted · luminous · weightless</p>
        </div>
      </div>
    </>
  );
}

function PremiumGold({ product }: AProps) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-noir" />
      <div className="absolute inset-0 mt-gold-shimmer" />
      <div className="absolute inset-3 rounded-xl border border-[hsl(var(--gold))/.4]" />
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center">
        <p className="text-[9px] uppercase tracking-[0.5em] text-[hsl(var(--gold))]">Luxury</p>
        <h4 className="mt-2 font-display text-2xl leading-tight text-white">{product.title}</h4>
        <div className="mx-auto mt-3 h-px w-12 bg-gradient-gold" />
        <p className="mt-2 text-[9px] uppercase tracking-[0.4em] text-white/60">Édition Or</p>
      </div>
    </>
  );
}
