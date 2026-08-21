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
        text="Northline is a practical equipment exchange for industrial buyers who value straight facts, visible availability and responsive conversations."
      />
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <h2 className="text-4xl uppercase">Procurement starts with what is known.</h2>
          <div className="space-y-5 leading-7 text-muted-foreground">
            <p>
              Northline Machinery Exchange is a configurable demonstration business identity.
              Replace the company details, proof points and contact information from the local admin
              before public use.
            </p>
            <p>
              The operating principle is simple: record the equipment condition, make documentation
              gaps visible and give buyers enough information to decide whether an inspection is
              worthwhile.
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
