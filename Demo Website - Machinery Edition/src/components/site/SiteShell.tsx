import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Phone, Mail, MapPin, ArrowUpRight, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/inventory", label: "Inventory" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5"
      aria-label="Ironclad Machinery Co. — home"
    >
      <span className="relative grid size-9 place-items-center bg-accent">
        <span className="animate-gear block size-4 border-2 border-graphite [clip-path:polygon(50%_0,68%_12%,88%_8%,92%_28%,100%_50%,92%_72%,88%_92%,68%_88%,50%_100%,32%_88%,12%_92%,8%_72%,0_50%,8%_28%,12%_8%,32%_12%)]" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "display block text-[1.05rem] uppercase tracking-[0.14em]",
            tone === "light" ? "text-bone" : "text-foreground",
          )}
        >
          Ironclad
        </span>
        <span className="kicker block text-[0.55rem] text-steel">Machinery Co.</span>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur transition-shadow",
        scrolled && "shadow-[0_1px_0_0_var(--color-border),0_10px_30px_-24px_#000]",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Logo />
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="kicker px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            to="/contact"
            className="kicker hidden border border-graphite bg-graphite px-4 py-3 text-bone transition-colors hover:bg-accent hover:text-graphite sm:inline-flex"
          >
            Talk to sales
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <div className="hatch h-[3px] w-full opacity-80" aria-hidden="true" />
      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto grid max-w-[1400px] gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="display flex items-center justify-between border-b border-border/60 py-3 text-lg uppercase tracking-wide"
              >
                {item.label}
                <ArrowUpRight className="size-4 text-accent" />
              </Link>
            ))}
            <Link
              to="/contact"
              className="kicker mt-3 inline-flex h-11 items-center justify-center bg-graphite px-4 text-bone"
            >
              Talk to sales
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { state } = useStore();
  const s = state.settings;
  return (
    <footer className="surface-dark mt-24">
      <div className="hatch h-[3px] w-full" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <Logo tone="light" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-steel-light/80">
            Ironclad Machinery Co. keeps pre-owned industrial equipment in one direct, searchable
            inventory. Every listing presents the records currently held on file.
          </p>
          <div className="measure-marks mt-8 h-3 w-40 opacity-50" aria-hidden="true" />
        </div>
        <div>
          <h3 className="kicker text-accent">Navigate</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[{ to: "/", label: "Home" }, ...NAV].map((i) => (
              <li key={i.label}>
                <Link to={i.to} className="text-steel-light/85 transition-colors hover:text-accent">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="kicker text-accent">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-steel-light/85">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
              <span>{s.address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
              <span>{s.phone}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
              <span>{s.email}</span>
            </li>
            <li className="pt-1 text-xs text-steel">GST: {s.gst}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-5 text-xs text-steel sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>
            © {new Date().getFullYear()} Ironclad Machinery Co. All details are placeholders pending
            owner input.
          </p>
          <Link to="/admin" className="transition-colors hover:text-accent">
            Admin console
          </Link>
        </div>
      </div>
    </footer>
  );
}

function QuickEnquiry() {
  const { state } = useStore();
  const number = state.settings.whatsapp.replace(/\D/g, "");
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hello Ironclad Machinery Co., I would like a quotation.")}`
    : "/contact";
  return (
    <a
      href={href}
      target={number ? "_blank" : undefined}
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 border border-graphite bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[6px_6px_0_0_var(--graphite)] transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Quick enquiry</span>
      <span className="sr-only">Send a WhatsApp enquiry (number is a placeholder)</span>
    </a>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <QuickEnquiry />
    </div>
  );
}
