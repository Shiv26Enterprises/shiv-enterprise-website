import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Machine } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({
  available,
  className,
}: {
  available: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "kicker inline-flex items-center gap-1.5 border px-2 py-1",
        available
          ? "border-accent bg-accent text-accent-foreground"
          : "border-steel bg-graphite text-steel-light",
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", available ? "bg-graphite" : "bg-steel")}
        aria-hidden="true"
      />
      {available ? "Available" : "Out of stock"}
    </span>
  );
}

export function MachineCard({
  machine,
  layout = "grid",
  index,
}: {
  machine: Machine;
  layout?: "grid" | "list";
  index?: number;
}) {
  const body = (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-graphite",
          layout === "grid" ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-52",
        )}
      >
        <img
          src={machine.image}
          alt={machine.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          <AvailabilityBadge available={machine.available} />
        </div>
        {typeof index === "number" && (
          <span className="display absolute bottom-3 right-4 text-5xl text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="kicker text-accent">Inventory record · {machine.specs.length} specs</p>
        <h3 className="mt-2 text-xl uppercase leading-tight">{machine.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{machine.caption}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Price on request
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            Details
            <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Link
      to="/inventory/$machineId"
      params={{ machineId: machine.id }}
      className={cn(
        "group flex border border-border bg-card transition-colors hover:border-graphite",
        layout === "grid" ? "flex-col" : "flex-col sm:grid sm:grid-cols-[minmax(0,18rem)_1fr]",
      )}
    >
      {body}
    </Link>
  );
}
