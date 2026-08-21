import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileCheck2, Truck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { AvailabilityBadge, MachineCard } from "@/components/site/MachineCard";
import { QuoteForm } from "@/components/site/QuoteForm";
import { useMachines } from "@/lib/store";

export const Route = createFileRoute("/inventory/$machineId")({ component: MachineDetail });
function MachineDetail() {
  const { machineId } = Route.useParams();
  const machines = useMachines();
  const machine = machines.find((m) => m.id === machineId);
  if (!machine) throw notFound();
  const related = machines.filter((m) => m.id !== machine.id).slice(0, 3);
  return (
    <SiteShell>
      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10">
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeft className="size-4 text-primary" />
          Back to inventory
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-graphite">
              <img src={machine.image} alt={machine.name} className="size-full object-cover" />
              <AvailabilityBadge available={machine.available} className="absolute left-4 top-4" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {machine.gallery.slice(0, 3).map((img, i) => (
                <img
                  key={`${img}-${i}`}
                  src={img}
                  alt={`${machine.name} view ${i + 1}`}
                  className="aspect-[4/3] size-full rounded-2xl border border-border object-cover"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="kicker text-primary">Machine record</p>
            <h1 className="mt-3 text-5xl uppercase leading-none sm:text-6xl">{machine.name}</h1>
            <p className="mt-5 text-lg text-muted-foreground">{machine.caption}</p>
            <div className="mt-7 border-y border-border py-5">
              <span className="kicker text-muted-foreground">Commercial basis</span>
              <strong className="display mt-1 block text-3xl uppercase">Price on request</strong>
            </div>
            <p className="mt-7 leading-7 text-muted-foreground">{machine.description}</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border p-4">
                <FileCheck2 className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Records shared as held</p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <Truck className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Delivery support scoped separately</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_.75fr]">
          <section>
            <p className="kicker text-accent">Technical schedule</p>
            <h2 className="mt-2 text-4xl uppercase">Known specifications</h2>
            <dl className="mt-7 border-t border-border">
              {machine.specs.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[.8fr_1.2fr] gap-4 border-b border-border py-4"
                >
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <aside className="rounded-[2rem] border border-border bg-white/60 p-6">
            <p className="kicker text-accent">Enquire on this machine</p>
            <h2 className="mt-2 text-3xl uppercase">Request documents & terms</h2>
            <div className="mt-6">
              <QuoteForm initialMachine={machine.name} />
            </div>
          </aside>
        </div>
        {related.length > 0 && (
          <section className="mt-20">
            <p className="kicker text-primary">More from the floor</p>
            <h2 className="mt-2 text-4xl uppercase">Continue through inventory</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((m, index) => (
                <MachineCard key={m.id} machine={m} index={index} />
              ))}
            </div>
          </section>
        )}
      </section>
    </SiteShell>
  );
}
