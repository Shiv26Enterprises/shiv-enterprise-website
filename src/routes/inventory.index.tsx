import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Grid2X2, List, Search } from "lucide-react";

import { MachineCard } from "@/components/site/MachineCard";
import { SiteShell } from "@/components/site/SiteShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        title="Industrial Machinery That Delivers Real Value."
        text="Search available equipment by name, specification, duty or condition, then open a complete record for the facts currently held on file."
      />
      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="grid gap-4 rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_16px_50px_-42px_var(--graphite)] sm:p-5 lg:grid-cols-[1.6fr_.8fr_.9fr_auto] lg:items-end">
          <label className="grid gap-2" htmlFor="inventory-search">
            <span className="kicker pl-1 text-muted-foreground">Search inventory</span>
            <span className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-accent"
                aria-hidden="true"
              />
              <input
                id="inventory-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, duty, output or specification"
                className="field h-12 rounded-xl bg-background pl-11 pr-4 transition hover:border-steel focus:border-accent"
              />
            </span>
          </label>

          <div className="grid gap-2">
            <label className="kicker pl-1 text-muted-foreground" htmlFor="availability-select">
              Availability
            </label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger
                id="availability-select"
                className="h-12 rounded-xl border-border bg-background px-4 font-semibold shadow-none transition hover:border-steel focus:ring-0 data-[state=open]:border-accent [&>svg]:text-accent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/10 bg-graphite p-1 text-bone shadow-2xl">
                <SelectItem
                  value="All"
                  className="rounded-lg py-2.5 focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-accent"
                >
                  All machinery
                </SelectItem>
                <SelectItem
                  value="Available"
                  className="rounded-lg py-2.5 focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-accent"
                >
                  Available now
                </SelectItem>
                <SelectItem
                  value="Sold / held"
                  className="rounded-lg py-2.5 focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-accent"
                >
                  Sold / held
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="kicker pl-1 text-muted-foreground" htmlFor="sort-select">
              Sort machinery
            </label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger
                id="sort-select"
                className="h-12 rounded-xl border-border bg-background px-4 font-semibold shadow-none transition hover:border-steel focus:ring-0 data-[state=open]:border-accent [&>svg]:text-accent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/10 bg-graphite p-1 text-bone shadow-2xl">
                <SelectItem
                  value="order"
                  className="rounded-lg py-2.5 focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-accent"
                >
                  Featured order
                </SelectItem>
                <SelectItem
                  value="name"
                  className="rounded-lg py-2.5 focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-accent"
                >
                  Name A–Z
                </SelectItem>
                <SelectItem
                  value="available"
                  className="rounded-lg py-2.5 focus:bg-accent focus:text-accent-foreground data-[state=checked]:text-accent"
                >
                  Available first
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <span className="kicker pl-1 text-muted-foreground">View</span>
            <div
              className="flex h-12 rounded-xl border border-border bg-background p-1"
              role="group"
              aria-label="Inventory layout"
            >
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={layout === "grid"}
                onClick={() => setLayout("grid")}
                className={`grid size-10 place-items-center rounded-lg transition ${layout === "grid" ? "bg-graphite text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Grid2X2 className="size-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={layout === "list"}
                onClick={() => setLayout("list")}
                className={`grid size-10 place-items-center rounded-lg transition ${layout === "list" ? "bg-graphite text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-7">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "machine" : "machines"} in view
          </p>
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
