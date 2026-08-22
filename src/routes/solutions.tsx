import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Check, PackageSearch, ScanSearch, Truck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageIntro } from "./inventory.index";

export const Route = createFileRoute("/solutions")({ component: Solutions });

const SERVICES = [
  {
    id: "buy",
    icon: PackageSearch,
    label: "Buy",
    number: "01",
    kicker: "Acquire with clarity",
    title: "Buy machinery around the duty—not the sales pitch.",
    description:
      "We begin with output, fuel, operating conditions, destination and timing, then identify equipment worth a closer technical review.",
    points: [
      "Focused requirement capture",
      "Availability and condition review",
      "Inspection and documentation coordination",
      "Commercial and delivery scope",
    ],
  },
  {
    id: "sell",
    icon: Boxes,
    label: "Sell",
    number: "02",
    kicker: "Present assets properly",
    title: "Turn surplus machinery into a usable buyer brief.",
    description:
      "Clear asset presentation reduces unproductive enquiries. We structure the specification, condition, photographs, records and site constraints.",
    points: [
      "Asset information checklist",
      "Condition and availability statement",
      "Buyer enquiry coordination",
      "Inspection-ready presentation",
    ],
  },
  {
    id: "source",
    icon: ScanSearch,
    label: "Source",
    number: "03",
    kicker: "Search beyond the listing",
    title: "Source specialised equipment through a precise brief.",
    description:
      "When the right machine is not in the live inventory, the requirement becomes a structured search across relevant owners, operators and dealers.",
    points: [
      "Technical brief development",
      "Targeted market outreach",
      "Shortlist qualification",
      "Inspection pathway",
    ],
  },
  {
    id: "relocate",
    icon: Truck,
    label: "Relocate",
    number: "04",
    kicker: "Move with a plan",
    title: "Coordinate machinery movement from shutdown to restart.",
    description:
      "Plant movement needs more than transport. We make dismantling, access, lifting, packing, loading and destination requirements visible early.",
    points: [
      "Site and access assessment",
      "Dismantling sequence",
      "Lifting, packing and logistics",
      "Re-erection support scope",
    ],
  },
] as const;

function Solutions() {
  const [activeId, setActiveId] = useState<(typeof SERVICES)[number]["id"]>("buy");
  const active = SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];
  const ActiveIcon = active.icon;

  return (
    <SiteShell>
      <PageIntro
        kicker="Machinery solutions"
        title="Four routes. One industrial desk."
        text="Buy, sell, source or relocate machinery through a process shaped around the asset, the site and the commercial objective."
      />

      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
        <div
          className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4"
          role="tablist"
          aria-label="Machinery services"
        >
          {SERVICES.map(({ id, icon: Icon, label, number }) => (
            <button
              key={id}
              id={`service-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeId === id}
              aria-controls={`service-panel-${id}`}
              onClick={() => setActiveId(id)}
              className={`group flex min-h-28 items-center justify-between border-b border-r border-border p-5 text-left transition ${activeId === id ? "bg-graphite text-bone" : "bg-card hover:bg-muted"}`}
            >
              <span>
                <span
                  className={`font-mono text-[0.62rem] ${activeId === id ? "text-accent" : "text-muted-foreground"}`}
                >
                  {number} / SERVICE
                </span>
                <span className="mt-3 block text-2xl uppercase">{label}</span>
              </span>
              <Icon
                className={`size-6 ${activeId === id ? "text-accent" : "text-muted-foreground transition group-hover:text-accent"}`}
              />
            </button>
          ))}
        </div>

        <div
          id={`service-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`service-tab-${active.id}`}
          className="surface-dark relative overflow-hidden"
        >
          <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="rule-grid pointer-events-none absolute inset-0 opacity-10"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 p-5 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-12 lg:p-14">
            <div>
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center bg-accent text-accent-foreground">
                  <ActiveIcon className="size-7" />
                </span>
                <p className="kicker text-accent">{active.kicker}</p>
              </div>
              <h2 className="mt-7 max-w-4xl text-4xl uppercase leading-[.88] text-bone sm:mt-9 sm:text-6xl">
                {active.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-steel-light/75 sm:text-lg">
                {active.description}
              </p>
              <Link to="/contact" className="industrial-button mt-9">
                Discuss this requirement <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="border border-white/10 bg-black/20 p-5 sm:p-7">
              <p className="kicker text-steel">What the process covers</p>
              <ul className="mt-6 space-y-3">
                {active.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 border-b border-white/10 pb-3 text-sm text-steel-light/85 last:border-0"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-accent text-accent-foreground">
                      <Check className="size-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-9 border-t border-white/10 pt-6">
                <span className="font-mono text-[0.62rem] text-accent">
                  WORKFLOW / {active.number}
                </span>
                <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                  {[0, 1, 2, 3].map((step) => (
                    <span
                      key={step}
                      className={`h-1 flex-1 ${step <= SERVICES.findIndex((service) => service.id === activeId) ? "bg-accent" : "bg-white/10"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
