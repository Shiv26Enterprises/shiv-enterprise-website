import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

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
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em]",
        available ? "bg-accent text-accent-foreground" : "bg-graphite text-bone",
        className,
      )}
    >
      <span
        className={cn("size-2 rounded-full", available ? "bg-primary" : "bg-steel")}
        aria-hidden="true"
      />
      {available ? "Available" : "Sold / held"}
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
  return (
    <Link
      to="/inventory/$machineId"
      params={{ machineId: machine.id }}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_24px_60px_-38px_var(--graphite)]",
        layout === "grid" ? "flex flex-col" : "grid sm:grid-cols-[minmax(0,22rem)_1fr]",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-graphite",
          layout === "grid" ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-auto sm:min-h-64",
        )}
      >
        <img
          src={machine.image}
          alt={machine.name}
          loading="lazy"
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/65 via-transparent to-transparent" />
        <AvailabilityBadge available={machine.available} className="absolute left-4 top-4" />
        {typeof index === "number" && (
          <span className="display absolute bottom-3 right-4 text-5xl text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="kicker text-primary">Inventory record · {machine.specs.length} specs</p>
        <h3 className="mt-3 text-2xl uppercase leading-[1.02]">{machine.name}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{machine.caption}</p>
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <span className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
            Price on request
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-12">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
