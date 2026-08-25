import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Factory,
  MoveRight,
  PackageSearch,
  Recycle,
  ScanSearch,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { MachineryMarquee } from "@/components/site/Marquee";
import { MachineCard } from "@/components/site/MachineCard";
import { MachineVisualizer } from "@/components/site/MachineVisualizer";
import { useMachines, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Index });

const ACTIONS = [
  {
    icon: PackageSearch,
    index: "01",
    title: "Buy machinery",
    text: "Search available assets and inspect the records currently held on file.",
    image: "/reference/buy-machinery.webp",
  },
  {
    icon: Boxes,
    index: "02",
    title: "Sell equipment",
    text: "Present surplus machinery with clear specifications, condition and location.",
    image: "/reference/sell-machinery.webp",
  },
  {
    icon: ScanSearch,
    index: "03",
    title: "Source equipment",
    text: "Turn a precise duty and capacity brief into a focused machinery search.",
    image: "/reference/source-machinery.webp",
  },
  {
    icon: Wrench,
    index: "04",
    title: "Dismantle assets",
    text: "Plan safe isolation, tagging, dismantling, lifting and prepared load-out.",
    image: "/reference/dismantling.webp",
  },
  {
    icon: Truck,
    index: "05",
    title: "Relocate assets",
    text: "Coordinate inspection, dismantling, packing, logistics and re-deployment.",
    image: "/reference/relocation.webp",
  },
  {
    icon: Recycle,
    index: "06",
    title: "Trade scrap",
    text: "Buy or sell machinery scrap, factory clearance lots and industrial metal scrap.",
    image: "/reference/steel-plant.webp",
  },
] as const;

const INDUSTRIES = [
  { name: "Rice processing", image: "/reference/rice-mill.webp" },
  { name: "Steel & metals", image: "/reference/steel-plant.webp" },
  { name: "Sugar & distillery", image: "/reference/sugar-mill.webp" },
  { name: "Oil processing", image: "/reference/oil-mill.webp" },
  { name: "Power & utilities", image: "/reference/turbine-boiler.webp" },
  { name: "General manufacturing", image: "/reference/about-factory.webp" },
] as const;

const CATEGORIES = [
  {
    name: "Rice mills",
    image: "/reference/rice-mill.webp",
    text: "Milling lines, grain handling, upgrades and complete processing assets.",
  },
  {
    name: "Steel plants",
    image: "/reference/steel-plant.webp",
    text: "Rolling equipment, production assets and material movement systems.",
  },
  {
    name: "Turbines & boilers",
    image: "/reference/turbine-boiler.webp",
    text: "Steam generation, cogeneration and balance-of-plant packages.",
  },
  {
    name: "Oil mills",
    image: "/reference/oil-mill.webp",
    text: "Extraction, processing and plant-level equipment coordination.",
  },
  {
    name: "Sugar mills",
    image: "/reference/sugar-mill.webp",
    text: "Process lines, utility equipment and complete asset movement.",
  },
  {
    name: "Generators",
    image: "/reference/generator.webp",
    text: "Industrial backup power, captive generation and site utilities.",
  },
] as const;

function Index() {
  const machines = useMachines();
  const { state } = useStore();
  const featured = machines.slice(0, 3);

  return (
    <SiteShell>
      <section className="surface-dark relative isolate overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
          aria-hidden="true"
        >
          <img
            src="/reference/hero-industrial.webp"
            alt=""
            className="size-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/50 to-graphite/20" />
        </div>
        <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="rule-grid pointer-events-none absolute inset-0 opacity-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1480px] items-center gap-9 px-4 py-10 sm:px-6 sm:py-14 lg:min-h-[640px] lg:grid-cols-[.88fr_1.12fr] lg:gap-12 lg:px-10 lg:py-16 xl:min-h-[680px]">
          <div className="relative z-10 animate-rise">
            <p className="kicker flex items-center gap-3 text-accent">
              <span className="h-px w-10 bg-accent" aria-hidden="true" />
              Industrial machinery · India & worldwide
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(3.1rem,8.5vw,6.9rem)] uppercase leading-[.84] tracking-tight text-bone sm:mt-7">
              Heavy machinery. <span className="text-accent">Smarter movement.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-steel-light/80 sm:text-lg">
              Buy, sell and source used industrial machinery or trade industrial scrap through one
              practical team—with transparent dealings and direct project coordination.
            </p>
            <div className="mt-7 grid gap-3 min-[420px]:flex min-[420px]:flex-wrap sm:mt-9">
              <Link to="/inventory" className="industrial-button group">
                Explore machinery{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="industrial-button-secondary">
                Share a requirement
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:mt-12 sm:grid-cols-4">
              {state.settings.proofPoints.map((point) => (
                <div key={point.label} className="bg-graphite/90 p-4">
                  <strong className="display block text-2xl text-bone">{point.value}</strong>
                  <span className="mt-1 block text-xs text-steel">{point.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 animate-rise [animation-delay:120ms]">
            <MachineVisualizer />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-px grid max-w-[1480px] border-l border-t border-border bg-background sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {ACTIONS.map(({ icon: Icon, index, title, text, image }) => (
          <Link
            key={title}
            to="/solutions"
            className="action-tile group overflow-hidden border-b border-r border-border"
          >
            <div className="relative h-36 overflow-hidden bg-graphite">
              <img
                src={image}
                alt=""
                loading="lazy"
                className="size-full object-cover opacity-80 grayscale-[20%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 to-transparent" />
              <span className="absolute bottom-3 left-3 grid size-10 place-items-center bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <span className="absolute right-3 top-3 font-mono text-xs text-bone/80">{index}</span>
            </div>
            <div className="p-5">
              <h2 className="text-2xl uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                See how it works{" "}
                <MoveRight className="size-4 text-accent transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <MachineryMarquee />

      <section className="mx-auto grid max-w-[1480px] items-stretch border-x border-b border-border lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[300px] overflow-hidden bg-graphite sm:min-h-[380px] lg:min-h-[420px]">
          <img
            src="/reference/about-factory.webp"
            alt="Industrial factory machinery"
            loading="lazy"
            className="size-full object-cover grayscale-[18%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 border-r border-t border-white/15 bg-graphite/90 p-5 text-bone backdrop-blur">
            <span className="kicker text-accent">Field-led support</span>
            <p className="mt-2 max-w-xs text-sm text-steel-light/75">
              Machinery, site conditions and commercial intent reviewed together.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-card p-7 sm:p-12 lg:p-16">
          <p className="kicker text-accent">Who we are</p>
          <h2 className="mt-4 text-4xl uppercase leading-[.9] sm:text-6xl">
            Machinery decisions made clearer.
          </h2>
          <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
            Shiv Enterprises connects buyers, sellers and asset owners with used machinery, surplus
            equipment and industrial scrap opportunities through transparent, practical
            coordination.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about" className="industrial-button">
              About Shiv Enterprises <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center border border-border px-5 font-semibold hover:border-accent"
            >
              Discuss a requirement
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker text-accent">Featured categories</p>
            <h2 className="mt-3 max-w-3xl text-4xl uppercase leading-[.9] sm:text-6xl">
              Assets across the plant floor.
            </h2>
          </div>
          <Link to="/inventory" className="hidden items-center gap-2 font-semibold sm:flex">
            View all machinery <ArrowRight className="size-4 text-accent" />
          </Link>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.name}
              to="/inventory"
              className="category-card group relative min-h-64 overflow-hidden bg-graphite sm:min-h-72"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-70 grayscale-[30%] transition duration-700 group-hover:scale-105 group-hover:opacity-85 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-bone">
                <span className="font-mono text-[0.62rem] text-accent">
                  CATEGORY / 0{index + 1}
                </span>
                <h3 className="mt-2 text-3xl uppercase">{category.name}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-steel-light/75">
                  {category.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker text-accent">Selected assets</p>
            <h2 className="mt-3 max-w-3xl text-4xl uppercase leading-[.9] sm:text-6xl">
              Machinery ready for a closer look.
            </h2>
          </div>
          <Link to="/inventory" className="hidden items-center gap-2 font-semibold sm:flex">
            View complete inventory <ArrowRight className="size-4 text-accent" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((machine, index) => (
            <MachineCard key={machine.id} machine={machine} index={index} />
          ))}
        </div>
        <Link to="/inventory" className="industrial-button mt-8 sm:hidden">
          View complete inventory <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="surface-dark relative overflow-hidden">
        <div
          className="hero-ambient pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1480px] gap-9 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.78fr_1.22fr] lg:gap-12 lg:px-10 lg:py-24">
          <div>
            <p className="kicker text-accent">Industries served</p>
            <h2 className="mt-4 text-4xl uppercase leading-[.88] text-bone sm:text-6xl">
              Built around real plant conditions.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-steel-light/70">
              Every sector brings different duties, access constraints, utilities and documentation.
              We start with that operating context.
            </p>
            <Link to="/industries" className="industrial-button mt-8">
              Explore industries <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {INDUSTRIES.map((industry, index) => (
              <div
                key={industry.name}
                className="industry-cell group relative flex min-h-40 items-end justify-between overflow-hidden bg-graphite/95 p-5"
              >
                <img
                  src={industry.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-15 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-25"
                />
                <div className="relative">
                  <span className="font-mono text-[0.62rem] text-accent">
                    SECTOR / 0{index + 1}
                  </span>
                  <h3 className="mt-3 text-2xl uppercase text-bone">{industry.name}</h3>
                </div>
                <Factory className="relative size-5 text-steel transition group-hover:text-accent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="kicker text-accent">A clearer process</p>
            <h2 className="mt-4 text-4xl uppercase leading-[.9] sm:text-6xl">
              From requirement to movement.
            </h2>
          </div>
          <ol className="border-t border-border">
            {[
              [
                "01",
                "Define the job",
                "Duty, output, location, condition and commercial objective.",
              ],
              [
                "02",
                "Review the facts",
                "Specifications, available records, inspection needs and open questions.",
              ],
              [
                "03",
                "Structure the scope",
                "Commercial terms, dismantling, loading, transport and field support.",
              ],
              [
                "04",
                "Coordinate execution",
                "A visible next-step plan with the right specialists around the asset.",
              ],
            ].map(([number, title, text]) => (
              <li
                key={number}
                className="process-row grid gap-4 border-b border-border py-6 sm:grid-cols-[72px_.75fr_1.25fr] sm:items-start"
              >
                <span className="font-mono text-sm text-accent">{number}</span>
                <h3 className="text-2xl uppercase">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden bg-accent px-6 py-16 text-accent-foreground sm:px-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
          <div
            className="absolute -right-14 -top-20 size-72 rounded-full border-[42px] border-graphite/10"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6" />
              <p className="kicker">Direct industrial support</p>
            </div>
            <h2 className="mt-5 max-w-4xl text-4xl uppercase leading-[.88] sm:text-6xl">
              Have machinery to buy, sell, source, dismantle or relocate?
            </h2>
          </div>
          <Link
            to="/contact"
            className="relative mt-8 inline-flex h-14 items-center gap-2 bg-graphite px-7 font-semibold text-bone lg:mt-0"
          >
            Start a conversation <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
