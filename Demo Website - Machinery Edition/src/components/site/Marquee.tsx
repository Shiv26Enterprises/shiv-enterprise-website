import { useMachines, useStore } from "@/lib/store";

const SPEED: Record<string, string> = { slow: "72s", normal: "46s", fast: "26s" };

export function MachineryMarquee() {
  const { state } = useStore();
  const machines = useMachines();
  if (!state.settings.marqueeEnabled || machines.length === 0) return null;
  const items = [...machines, ...machines];
  return (
    <section
      className="overflow-hidden border-y border-primary bg-primary py-4 text-primary-foreground"
      aria-label="Current machine inventory"
    >
      <ul
        className="animate-marquee flex w-max items-center"
        style={{ "--marquee-duration": SPEED[state.settings.marqueeSpeed] } as React.CSSProperties}
      >
        {items.map((machine, index) => (
          <li
            key={`${machine.id}-${index}`}
            className="display flex items-center gap-5 px-7 text-xl uppercase"
            aria-hidden={index >= machines.length ? "true" : undefined}
          >
            <span>{machine.name}</span>
            <span className="size-2 rounded-full bg-accent" />
          </li>
        ))}
      </ul>
    </section>
  );
}
