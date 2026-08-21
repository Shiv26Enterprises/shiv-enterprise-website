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
        kicker="Current floor list"
        title="One inventory. Every machine."
        text="Search the full equipment list by name, specification, duty or condition—without navigating category trees."
      />
      <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10">
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
            <strong className="text-foreground">{filtered.length}</strong> machines in view
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
    <section className="surface-dark relative overflow-hidden rounded-b-[2.5rem]">
      <div className="absolute -right-20 -top-32 size-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="kicker text-accent">{kicker}</p>
        <h1 className="mt-5 max-w-5xl text-5xl uppercase leading-[.9] text-bone sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-7 text-steel-light/80">{text}</p>
      </div>
    </section>
  );
}
