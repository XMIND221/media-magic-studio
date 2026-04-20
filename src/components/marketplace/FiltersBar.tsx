import { cn } from "@/lib/utils";

export interface FilterState {
  premiumOnly: boolean;
  storyOnly: boolean;
  format: "all" | "portrait" | "story" | "paysage" | "carré" | "ticket" | "badge" | "menu";
}

interface Props {
  value: FilterState;
  onChange: (v: FilterState) => void;
}

const FORMATS: FilterState["format"][] = ["all", "portrait", "story", "paysage", "carré", "ticket", "badge", "menu"];

export function FiltersBar({ value, onChange }: Props) {
  return (
    <div className="container mx-auto mt-3 flex flex-wrap items-center gap-2 px-4">
      <Toggle
        active={value.premiumOnly}
        onClick={() => onChange({ ...value, premiumOnly: !value.premiumOnly })}
        label="Premium"
      />
      <Toggle
        active={value.storyOnly}
        onClick={() => onChange({ ...value, storyOnly: !value.storyOnly })}
        label="Story"
      />
      <div className="ml-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] tracking-[0.3em] text-muted-foreground">FORMAT</span>
        {FORMATS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onChange({ ...value, format: f })}
            className={cn(
              "whitespace-nowrap rounded-md border px-2 py-1 text-[11px] capitalize transition-luxe",
              value.format === f
                ? "border-gold/60 text-gold"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? "tous" : f}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-luxe",
        active
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-border bg-card/60 text-foreground/70 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
