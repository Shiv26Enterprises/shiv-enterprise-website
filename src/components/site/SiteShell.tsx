import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/inventory", label: "Machinery" },
  { to: "/solutions", label: "Solutions" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ tone = "light" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Shiv Enterprises — home">
      <span
        className="block size-10 shrink-0 overflow-hidden rounded-full sm:size-12"
        aria-hidden="true"
      >
        <img
          src="/brand/shiv-enterprises-mark.png"
          alt=""
          className="size-full object-contain transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
        />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "display block text-base uppercase tracking-[0.08em] sm:text-[1.05rem]",
            tone === "light" ? "text-bone" : "text-foreground",
          )}
        >
          Shiv <span className="text-accent">Enterprises</span>
        </span>
        <span className="kicker mt-1 block text-[0.5rem] text-steel">Machinery division</span>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

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
        "sticky top-0 z-50 border-b border-white/10 bg-graphite/95 text-bone backdrop-blur-xl transition-shadow",
        scrolled && "shadow-[0_14px_40px_-26px_#000]",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center gap-4 px-4 sm:h-[4.6rem] sm:gap-6 sm:px-6 lg:px-10">
        <Logo />
        <nav className="ml-auto hidden items-stretch self-stretch xl:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="kicker relative my-3 flex items-center rounded-md border border-transparent px-4 text-steel-light/70 transition-all duration-200 hover:border-accent/35 hover:bg-accent/12 hover:text-accent hover:shadow-[0_8px_24px_-16px_rgba(249,115,22,.9)]"
              activeProps={{ className: "nav-active border-accent/40 bg-accent/15 text-bone" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <Link
            to="/contact"
            className="hidden h-11 items-center gap-2 bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:bg-bone sm:inline-flex"
          >
            Get a quote <ArrowUpRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center border border-white/20 text-bone xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <div className="hatch h-[3px] w-full opacity-85" aria-hidden="true" />
      {open && (
        <div id="mobile-nav" className="border-t border-white/10 bg-graphite xl:hidden">
          <nav className="mx-auto grid max-w-[1480px] px-4 py-4 sm:px-6" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="display flex items-center justify-between rounded-md border border-transparent px-3 py-3.5 text-lg uppercase tracking-wide text-bone transition-colors hover:border-accent/35 hover:bg-accent/10"
              >
                {item.label}
                <ArrowUpRight className="size-4 text-accent" />
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 bg-accent px-5 font-semibold text-accent-foreground sm:hidden"
            >
              Get a quote <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { state } = useStore();
  const settings = state.settings;

  return (
    <footer className="surface-dark mt-16 sm:mt-20 lg:mt-24">
      <div className="hatch h-[3px] w-full" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.75fr_1fr] lg:px-10">
        <div>
          <Logo />
          <p className="mt-6 max-w-md text-sm leading-7 text-steel-light/75">
            Industrial machinery sales, sourcing, inspection coordination and plant relocation—built
            around direct communication and usable asset information.
          </p>
          <div className="measure-marks mt-8 h-3 w-40 opacity-50" aria-hidden="true" />
        </div>
        <div>
          <h3 className="kicker text-accent">Machinery</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/inventory" className="text-steel-light/80 transition hover:text-accent">
                Current inventory
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="text-steel-light/80 transition hover:text-accent">
                Buy machinery
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="text-steel-light/80 transition hover:text-accent">
                Sell equipment
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="text-steel-light/80 transition hover:text-accent">
                Plant relocation
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="kicker text-accent">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/about" className="text-steel-light/80 transition hover:text-accent">
                About us
              </Link>
            </li>
            <li>
              <Link to="/industries" className="text-steel-light/80 transition hover:text-accent">
                Industries
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-steel-light/80 transition hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-steel-light/80 transition hover:text-accent">
                Admin console
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="kicker text-accent">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm text-steel-light/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-2 px-4 py-5 text-xs text-steel sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>
            © {new Date().getFullYear()} Shiv Enterprises. All machinery details remain subject to
            inspection and confirmation.
          </p>
          <p>Industrial assets · Serious execution</p>
        </div>
      </div>
    </footer>
  );
}

function QuickEnquiry() {
  const { state } = useStore();
  const number = state.settings.whatsapp.replace(/\D/g, "");
  const canUseWhatsApp = number.length >= 8 && !/^0+$/.test(number);
  const href = canUseWhatsApp
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hello Shiv Enterprises, I would like to discuss an industrial machinery requirement.")}`
    : "/contact";

  return (
    <a
      href={href}
      target={canUseWhatsApp ? "_blank" : undefined}
      rel={canUseWhatsApp ? "noreferrer" : undefined}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 border border-graphite bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[6px_6px_0_0_var(--graphite)] transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Quick enquiry</span>
      <span className="sr-only">
        {canUseWhatsApp ? "Send a WhatsApp enquiry" : "Open the contact page"}
      </span>
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
