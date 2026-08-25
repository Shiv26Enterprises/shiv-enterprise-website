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
        title="The Right Machine. The Right Result."
        text="Share the duty, output, location and timing. We’ll connect your requirement to the full inventory and reply with what is actually available."
      />
      <section className="mx-auto grid max-w-[1280px] gap-7 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-10 lg:py-20">
        <div className="space-y-4">
          <ContactItem icon={MapPin} label="Address" value={s.address} />
          <ContactItem icon={Phone} label="Phone" value={s.phone} />
          <ContactItem icon={Mail} label="Email" value={s.email} />
          <div className="rounded-2xl border border-dashed border-steel p-5 text-sm leading-6 text-muted-foreground">
            For the quickest response, use the Quick enquiry button to connect with our team on
            WhatsApp at +91 87965 65443.
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-white/70 p-5 shadow-[0_24px_70px_-50px_var(--graphite)] sm:rounded-[2rem] sm:p-9">
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
