import { Link } from "@tanstack/react-router";
import { useMachines, useStore } from "@/lib/store";

const SPEED: Record<string, string> = { slow: "72s", normal: "46s", fast: "26s" };

export function MachineryMarquee() {
  const { state } = useStore();
  const machines = useMachines();
  if (!state.settings.marqueeEnabled || machines.length === 0) return null;
  const items = [...machines, ...machines];
  return (
    <section
      className="machinery-marquee overflow-hidden border-y border-primary bg-primary py-3 text-primary-foreground"
      aria-label="Current machine inventory"
    >
      <ul
        className="animate-marquee flex w-max items-stretch hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        style={{ "--marquee-duration": SPEED[state.settings.marqueeSpeed] } as React.CSSProperties}
      >
        {items.map((machine, index) => (
          <li
            key={`${machine.id}-${index}`}
            className="px-1.5"
            aria-hidden={index >= machines.length ? "true" : undefined}
          >
            <Link
              to="/inventory/$machineId"
              params={{ machineId: machine.id }}
              tabIndex={index >= machines.length ? -1 : undefined}
              className="group flex h-full w-[19rem] items-center gap-3 border border-white/15 bg-white/[0.045] p-2 transition hover:border-accent hover:bg-white/[0.09]"
            >
              <span className="relative block h-16 w-24 shrink-0 overflow-hidden bg-graphite-soft">
                <img
                  src={machine.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover grayscale-[35%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="kicker block text-accent">
                  {machine.available ? "Available" : "On request"}
                </span>
                <span className="display mt-1 line-clamp-2 block text-lg uppercase leading-tight text-bone">
                  {machine.name}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
