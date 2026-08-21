import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Boxes, Globe2, Sparkles, Wrench } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { MachineryMarquee } from "@/components/site/Marquee";
import { MachineCard } from "@/components/site/MachineCard";
import { HERO_IMAGE, useMachines, useStore } from "@/lib/store";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const machines = useMachines();
  const { state } = useStore();
  const featured = machines.slice(0, 3);
  return (
    <SiteShell>
      <section className="surface-dark relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute -left-32 top-12 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="mx-auto grid min-h-[720px] max-w-[1480px] lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 flex flex-col justify-center px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <p className="kicker text-accent">
              One inventory · Direct conversations · Worldwide reach
            </p>
            <h1 className="mt-6 max-w-3xl text-6xl uppercase leading-[.82] tracking-tight text-bone sm:text-7xl lg:text-[7.6rem]">
              Serious machines. <span className="text-accent">Zero clutter.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-steel-light/80 sm:text-lg">
              A direct, ever-changing inventory of industrial equipment. No category maze—just the
              machines, their condition and the information buyers need.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/inventory"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-graphite"
              >
                Explore inventory <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 font-semibold text-bone hover:border-accent"
              >
                Start a conversation
              </Link>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {state.settings.proofPoints.map((p) => (
                <div key={p.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <strong className="display block text-2xl text-bone">{p.value}</strong>
                  <span className="mt-1 block text-xs text-steel">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-full">
            <img
              src={HERO_IMAGE}
              alt="Industrial turbine workshop"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-graphite via-transparent to-transparent lg:block" />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/15 bg-graphite/90 p-5 text-bone backdrop-blur">
              <span className="kicker text-accent">Inventory, simplified</span>
              <p className="mt-1 text-sm">Every machine in one searchable floor list.</p>
            </div>
          </div>
        </div>
      </section>
      <MachineryMarquee />
      <section className="mx-auto max-w-[1480px] px-4 py-24 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker text-accent">On the floor</p>
            <h2 className="mt-2 text-4xl uppercase sm:text-5xl">Featured machinery</h2>
          </div>
          <Link to="/inventory" className="hidden items-center gap-2 font-semibold sm:flex">
            View all <ArrowRight className="size-4 text-accent" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((m, index) => (
            <MachineCard key={m.id} machine={m} index={index} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex min-h-96 flex-col justify-between p-8 sm:p-12">
            <Sparkles className="size-9 text-accent" />
            <div>
              <p className="kicker text-accent">No category maze</p>
              <h2 className="mt-4 text-5xl uppercase leading-[.9] sm:text-6xl">
                Search the whole floor at once.
              </h2>
            </div>
          </div>
          <div className="bg-accent p-8 text-accent-foreground sm:p-12">
            <p className="max-w-xl text-xl leading-8">
              Machine types change. Buyer requirements overlap. Northline keeps every listing
              together so a name, output, duty or specification takes you straight to the right
              record.
            </p>
            <Link
              to="/inventory"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-graphite px-6 py-3 font-semibold text-bone"
            >
              Open the inventory <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1480px] gap-8 px-4 py-24 sm:px-6 lg:grid-cols-3 lg:px-10">
        {[
          {
            icon: Boxes,
            title: "Sourced deliberately",
            text: "We match duty, capacity, fuel and delivery constraints before proposing equipment.",
          },
          {
            icon: BadgeCheck,
            title: "Condition made clear",
            text: "Listings separate known facts from items that still require inspection or statutory review.",
          },
          {
            icon: Globe2,
            title: "Delivery coordinated",
            text: "Documentation, dismantling, packing and freight support can be scoped around the project.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="border-t-4 border-graphite pt-6">
            <Icon className="size-7 text-accent" />
            <h3 className="mt-5 text-2xl uppercase">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>
      <section className="surface-dark mx-auto max-w-[1480px] rounded-[2.5rem] px-6 py-16 text-center sm:px-12">
        <Wrench className="mx-auto size-8 text-accent" />
        <h2 className="mt-5 text-4xl uppercase text-bone sm:text-5xl">
          Have a machine requirement?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-steel-light/75">
          Share the duty, capacity and destination. We’ll respond with availability and the records
          currently on file.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-7 font-semibold text-graphite"
        >
          Start an enquiry
        </Link>
      </section>
    </SiteShell>
  );
}
