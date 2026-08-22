import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";

import { MachineCard } from "@/components/site/MachineCard";
import { SiteShell } from "@/components/site/SiteShell";
import { useMachines } from "@/lib/store";

export const Route = createFileRoute("/inventory/")({ component: InventoryPage });

function InventoryPage() {
  const machines = useMachines();
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("order");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const filtered = useMemo(
    () =>
      machines
        .filter(
          (machine) =>
            (availability === "All" ||
              (availability === "Available" ? machine.available : !machine.available)) &&
            `${machine.name} ${machine.caption} ${machine.description} ${machine.specs.map((spec) => `${spec.label} ${spec.value}`).join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "available"
              ? Number(b.available) - Number(a.available)
              : a.order - b.order,
        ),
    [machines, query, availability, sort],
  );
  return (
    <SiteShell>
      <PageIntro
        kicker="Current machinery"
        title="Industrial assets. Ready for a closer look."
        text="Search available equipment by name, specification, duty or condition, then open a complete record for the facts currently held on file."
      />
      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="grid gap-3 rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_16px_50px_-42px_var(--graphite)] lg:grid-cols-[1.6fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">Search inventory</span>
            <Search className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, duty, output or specification"
              className="field rounded-full pl-11"
            />
          </label>
          <select
            aria-label="Availability"
            className="field rounded-full"
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          >
            <option>All</option>
            <option>Available</option>
            <option>Sold / held</option>
          </select>
          <select
            aria-label="Sort"
            className="field rounded-full"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="order">Featured order</option>
            <option value="name">Name A–Z</option>
            <option value="available">Available first</option>
          </select>
          <div className="flex rounded-full border border-border p-1">
            <button
              aria-label="Grid view"
              onClick={() => setLayout("grid")}
              className={`grid size-10 place-items-center rounded-full ${layout === "grid" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <Grid2X2 className="size-4" />
            </button>
            <button
              aria-label="List view"
              onClick={() => setLayout("list")}
              className={`grid size-10 place-items-center rounded-full ${layout === "list" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
        <div className="mt-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "machine" : "machines"} in view
          </p>
          <SlidersHorizontal className="size-4 text-primary" />
        </div>
        {filtered.length ? (
          <div
            className={`mt-8 grid gap-6 ${layout === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
          >
            {filtered.map((machine, index) => (
              <MachineCard key={machine.id} machine={machine} layout={layout} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-steel p-16 text-center">
            <h2 className="text-2xl uppercase">Nothing matches yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a broader name, output or duty.
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

export function PageIntro({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <section className="surface-dark relative isolate overflow-hidden border-b border-white/10">
      <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="rule-grid pointer-events-none absolute inset-0 opacity-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-8 -top-16 font-mono text-[12rem] font-bold leading-none text-white/[0.025] sm:text-[15rem]"
        aria-hidden="true"
      >
        SE
      </div>
      <div className="relative mx-auto grid max-w-[1480px] gap-5 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,.75fr)] lg:items-end lg:gap-12 lg:px-10 lg:py-14">
        <div>
          <p className="kicker flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent sm:w-10" aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="mt-4 max-w-5xl text-[clamp(2.35rem,6vw,4.75rem)] uppercase leading-[.9] text-bone">
            {title}
          </h1>
        </div>
        <div className="lg:pb-1">
          <p className="max-w-2xl text-base leading-6 text-steel-light/80 sm:text-lg sm:leading-7">
            {text}
          </p>
          <p className="kicker mt-4 flex items-center gap-2 text-[.58rem] text-accent/85">
            <span className="h-5 w-px bg-accent/60" aria-hidden="true" />
            Explore below
          </p>
        </div>
      </div>
    </section>
  );
}
