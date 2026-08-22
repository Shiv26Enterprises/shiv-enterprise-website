import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bolt, Building2, Factory, Flame, Layers3, Wheat } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageIntro } from "./inventory.index";

export const Route = createFileRoute("/industries")({ component: Industries });

const SECTORS = [
  {
    icon: Bolt,
    title: "Power & utilities",
    text: "Turbines, boilers, generators, transformers and complete captive generation packages.",
    focus: "Generation · steam · backup power",
  },
  {
    icon: Flame,
    title: "Steel & metals",
    text: "Heavy process equipment, rolling support systems, material movement and utility assets.",
    focus: "Heat · movement · plant utilities",
  },
  {
    icon: Wheat,
    title: "Sugar & distillery",
    text: "Cogeneration, process steam, milling support and plant utility equipment.",
    focus: "Cogeneration · processing · utilities",
  },
  {
    icon: Layers3,
    title: "Paper & process",
    text: "Steam generation, pumps, drives, power packages and process plant auxiliaries.",
    focus: "Steam · pumping · continuous duty",
  },
  {
    icon: Building2,
    title: "Cement & minerals",
    text: "Power, crushing support, material handling and heavy-duty plant infrastructure.",
    focus: "Heavy duty · dust · high load",
  },
  {
    icon: Factory,
    title: "General manufacturing",
    text: "Production utilities, standby power and relocatable machinery for growing facilities.",
    focus: "Uptime · expansion · relocation",
  },
] as const;

function Industries() {
  return (
    <SiteShell>
      <PageIntro
        kicker="Industries served"
        title="Machinery makes sense in context."
        text="The right asset depends on the process, duty cycle, utilities, site access and future operating plan—not only a specification sheet."
      />

      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
        <div className="grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
          {SECTORS.map(({ icon: Icon, title, text, focus }, index) => (
            <article
              key={title}
              className="sector-card group relative min-h-64 overflow-hidden border-b border-r border-border bg-card p-6 sm:min-h-72 sm:p-8 lg:min-h-80"
            >
              <div
                className="rule-grid pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-30"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center border border-border bg-background transition group-hover:border-accent group-hover:bg-accent">
                    <Icon className="size-6" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <div className="mt-auto pt-14">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">
                    {focus}
                  </p>
                  <h2 className="mt-4 text-3xl uppercase">{title}</h2>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="surface-dark relative overflow-hidden p-6 sm:p-12">
          <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="kicker text-accent">A different sector?</p>
              <h2 className="mt-4 max-w-4xl text-4xl uppercase leading-[.9] text-bone sm:text-6xl">
                Tell us the process and the constraint.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-steel-light/75">
                A clear duty brief is more useful than forcing a requirement into the wrong
                category.
              </p>
            </div>
            <Link to="/contact" className="industrial-button">
              Share your requirement <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
