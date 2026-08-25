import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  Check,
  Eye,
  Factory,
  Handshake,
  PackageSearch,
  Recycle,
  ShieldCheck,
  Target,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageIntro } from "./inventory.index";

export const Route = createFileRoute("/about")({ component: About });

const MACHINERY_TYPES = [
  "CNC machines",
  "CNC lathe machines",
  "VMC / HMC machines",
  "Lathe machines",
  "Milling machines",
  "Drilling machines",
  "Grinding machines",
  "Boring machines",
  "Press machines",
  "Sheet metal machinery",
  "Gear machinery",
  "Fabrication machinery",
  "Industrial equipment",
  "Other used and surplus industrial machines",
] as const;

const SCRAP_TYPES = [
  "Machinery scrap",
  "Ferrous scrap",
  "Non-ferrous scrap",
  "Industrial metal scrap",
  "Plant and machinery scrap",
  "Factory clearance scrap",
  "Other industrial scrap materials",
] as const;

const REASONS = [
  {
    icon: Eye,
    title: "Transparent dealings",
    text: "Clear communication and straightforward business transactions from the first enquiry.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Competitive pricing",
    text: "Market-aware pricing for both machinery and scrap buying and selling requirements.",
  },
  {
    icon: PackageSearch,
    title: "Wide machinery range",
    text: "Access to different categories of used, pre-owned and surplus industrial machinery.",
  },
  {
    icon: Factory,
    title: "Industrial knowledge",
    text: "Practical understanding of machinery, plant assets and industrial scrap markets.",
  },
  {
    icon: ShieldCheck,
    title: "Professional service",
    text: "Responsive coordination from requirement review through inspection and final transaction.",
  },
  {
    icon: Handshake,
    title: "Long-term relationships",
    text: "A business approach built around lasting trust with buyers, sellers and partners.",
  },
] as const;

function About() {
  return (
    <SiteShell>
      <PageIntro
        kicker="About Shiv Enterprises"
        title="Your trusted partner for machinery and scrap trading"
        text="Professionally managed buying, selling and sourcing solutions for used industrial machinery, surplus equipment and industrial scrap."
      />

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
          <div>
            <p className="kicker text-accent">Who we are</p>
            <h2 className="mt-4 text-3xl uppercase leading-[.95] sm:text-5xl">
              Reliable opportunities for genuine buyers and sellers.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-muted-foreground">
            <p>
              We are a professionally managed trading company specialising in the buying and selling
              of used, pre-owned and surplus industrial machinery. Along with machinery trading, we
              deal in industrial scrap, machinery scrap and a variety of metal scrap materials.
            </p>
            <p>
              Our objective is to connect genuine buyers and sellers with reliable business
              opportunities while providing competitive pricing, transparent dealings and
              professional service.
            </p>
            <p>
              With industrial market knowledge and strong business relationships, we help customers
              find machinery suited to their requirements, budget and application.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="kicker text-accent">What we do</p>
            <h2 className="mt-4 text-4xl uppercase leading-[.9] sm:text-6xl">
              Two markets. One practical trading desk.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-border bg-background p-6 sm:p-8">
              <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
                <Factory className="size-7" />
              </span>
              <h3 className="mt-6 text-3xl uppercase">Used industrial machinery</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                We buy and sell a broad range of used and pre-owned equipment. We also purchase old,
                surplus and unused machinery from factories, manufacturing units, workshops and
                industrial plants.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="Machinery categories">
                {MACHINERY_TYPES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6">
                    <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-dark relative overflow-hidden rounded-[1.75rem] p-6 text-bone sm:p-8">
              <div
                className="hero-ambient pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
              <div className="relative">
                <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Recycle className="size-7" />
                </span>
                <h3 className="mt-6 text-3xl uppercase">Industrial scrap trading</h3>
                <p className="mt-4 leading-7 text-steel-light/80">
                  We provide a smooth, professional solution for businesses looking to dispose of
                  old machinery, equipment and industrial scrap through suitable buying and selling
                  opportunities.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="Scrap categories">
                  {SCRAP_TYPES.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-6 text-steel-light/90"
                    >
                      <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-5 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-20">
        <article className="rounded-[1.75rem] border border-border bg-card p-7 sm:p-9">
          <Target className="size-8 text-accent" />
          <p className="kicker mt-6 text-accent">Our mission</p>
          <h2 className="mt-3 text-3xl uppercase">Reliable, transparent and value-driven.</h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Our mission is to understand each customer&apos;s requirements and provide practical
            trading solutions that create lasting value for machinery and industrial scrap buyers
            and sellers.
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border bg-card p-7 sm:p-9">
          <Eye className="size-8 text-accent" />
          <p className="kicker mt-6 text-accent">Our vision</p>
          <h2 className="mt-3 text-3xl uppercase">A trusted name in industrial trading.</h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Our vision is to be known for honest business practices, competitive pricing,
            professional service and long-term relationships across the used machinery and scrap
            trading industry.
          </p>
        </article>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="kicker text-accent">Why choose us</p>
            <h2 className="mt-4 text-4xl uppercase leading-[.9] sm:text-6xl">
              Professional support built around trust.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-border bg-background p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <Icon className="size-6 text-accent" />
                <h3 className="mt-5 text-2xl uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="surface-dark relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14">
          <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-4xl">
              <p className="kicker text-accent">Our commitment</p>
              <h2 className="mt-4 text-4xl uppercase leading-[.9] text-bone sm:text-6xl">
                Integrity, transparency and professionalism.
              </h2>
              <p className="mt-6 max-w-3xl leading-7 text-steel-light/80">
                Whether you want to buy a used machine, sell surplus machinery, dispose of old
                factory equipment or trade industrial scrap, we are ready to help you find a
                suitable solution.
              </p>
              <p className="mt-6 font-mono text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                Buy • Sell • Source • Trade
              </p>
            </div>
            <Link to="/contact" className="industrial-button w-fit">
              Discuss your requirement <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
