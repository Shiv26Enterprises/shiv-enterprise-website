import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { QuoteForm } from "@/components/site/QuoteForm";
import { useStore } from "@/lib/store";
import { PageIntro } from "./inventory.index";
export const Route = createFileRoute("/contact")({ component: Contact });
function Contact() {
  const { state } = useStore();
  const s = state.settings;
  return (
    <SiteShell>
      <PageIntro
        kicker="Contact"
        title="Start with the job, not the jargon"
        text="Share the duty, output, location and timing. We’ll connect your requirement to the full inventory and reply with what is actually available."
      />
      <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-4">
          <ContactItem icon={MapPin} label="Address" value={s.address} />
          <ContactItem icon={Phone} label="Phone" value={s.phone} />
          <ContactItem icon={Mail} label="Email" value={s.email} />
          <div className="rounded-2xl border border-dashed border-steel p-5 text-sm text-muted-foreground">
            These details are editable in Admin → Company. Replace all placeholders before launch.
          </div>
        </div>
        <div className="rounded-[2rem] border border-border bg-white/70 p-6 shadow-[0_24px_70px_-50px_var(--graphite)] sm:p-9">
          <QuoteForm />
        </div>
      </section>
    </SiteShell>
  );
}
function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="kicker text-muted-foreground">{label}</p>
        <p className="mt-2 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
