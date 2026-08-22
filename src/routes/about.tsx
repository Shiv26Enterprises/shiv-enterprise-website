import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, Eye, Handshake } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageIntro } from "./inventory.index";
export const Route = createFileRoute("/about")({ component: About });
function About() {
  return (
    <SiteShell>
      <PageIntro
        kicker="How we work"
        title="A clearer route to the right machine"
        text="Shiv Enterprises supports industrial buyers, sellers and plant owners with straight facts, visible availability and responsive project coordination."
      />
      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <h2 className="text-3xl uppercase sm:text-4xl">Procurement starts with what is known.</h2>
          <div className="space-y-5 leading-7 text-muted-foreground">
            <p>
              Shiv Enterprises is built around a practical idea: machinery decisions improve when
              specifications, condition, records and open questions are made visible early.
            </p>
            <p>
              From a single generator to a complete plant lot, the team connects commercial intent
              with inspection, dismantling, logistics and field requirements before execution
              begins.
            </p>
          </div>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              i: Eye,
              t: "Condition stated",
              p: "Available facts and open inspection items stay separate.",
            },
            {
              i: ClipboardCheck,
              t: "Records indexed",
              p: "Specifications, images and notes live with each machine record.",
            },
            {
              i: Handshake,
              t: "Scope agreed",
              p: "Commercial, dismantling and logistics responsibilities are made explicit.",
            },
          ].map(({ i: I, t, p }) => (
            <article
              key={t}
              className="rounded-[1.75rem] border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary"
            >
              <span className="grid size-12 place-items-center rounded-full bg-accent">
                <I className="size-6 text-accent-foreground" />
              </span>
              <h3 className="mt-5 text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{p}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
