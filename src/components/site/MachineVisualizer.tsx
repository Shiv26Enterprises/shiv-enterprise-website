import { useState, type CSSProperties } from "react";
import { Activity, Gauge, Thermometer, Zap } from "lucide-react";

const PROFILES = [
  {
    id: "turbine",
    label: "Turbine",
    eyebrow: "Power generation",
    title: "3 MW back-pressure turbine",
    description:
      "Multi-stage turbine train with reduction gearbox, governing system and brushless alternator.",
    metrics: [
      { label: "Output", value: "3 MW" },
      { label: "Inlet", value: "42 bar" },
      { label: "Speed", value: "8,150 rpm" },
    ],
  },
  {
    id: "boiler",
    label: "Boiler",
    eyebrow: "Steam systems",
    title: "12 TPH water-tube boiler",
    description:
      "Bi-drum pressure package with combustion air, feed-water and instrumentation scope.",
    metrics: [
      { label: "Capacity", value: "12 TPH" },
      { label: "Pressure", value: "45 bar" },
      { label: "Steam", value: "400 °C" },
    ],
  },
  {
    id: "generator",
    label: "Generator",
    eyebrow: "Standby power",
    title: "1,500 kVA diesel generator",
    description:
      "Prime-rated power package with acoustic enclosure, AMF panel and recorded test history.",
    metrics: [
      { label: "Rating", value: "1,500 kVA" },
      { label: "Voltage", value: "415 V" },
      { label: "Frequency", value: "50 Hz" },
    ],
  },
  {
    id: "plant",
    label: "Plant",
    eyebrow: "Complete assets",
    title: "15 MW cogeneration island",
    description:
      "Boiler, turbine-generator, water treatment, controls and balance-of-plant as one coordinated lot.",
    metrics: [
      { label: "Output", value: "15 MW" },
      { label: "Boiler", value: "70 TPH" },
      { label: "Scope", value: "Turnkey lot" },
    ],
  },
] as const;

export function MachineVisualizer() {
  const [activeId, setActiveId] = useState<(typeof PROFILES)[number]["id"]>("turbine");
  const active = PROFILES.find((profile) => profile.id === activeId) ?? PROFILES[0];

  return (
    <div className="machine-deck relative isolate overflow-hidden border border-white/15 bg-black/25 text-bone shadow-[0_40px_100px_-55px_#000]">
      <div
        className="rule-grid pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="status-pulse size-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="kicker text-steel-light">Machinery control deck</span>
        </div>
        <span className="font-mono text-[0.62rem] text-steel">LIVE / SE-01</span>
      </div>

      <div
        className="relative grid grid-cols-4 border-b border-white/10"
        role="tablist"
        aria-label="Machinery profiles"
      >
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            id={`machine-tab-${profile.id}`}
            type="button"
            role="tab"
            aria-selected={activeId === profile.id}
            aria-controls={`machine-panel-${profile.id}`}
            onClick={() => setActiveId(profile.id)}
            className={`kicker min-h-12 border-r border-white/10 px-2 text-center transition last:border-r-0 ${
              activeId === profile.id
                ? "bg-accent text-accent-foreground"
                : "text-steel-light hover:bg-white/5 hover:text-bone"
            }`}
          >
            {profile.label}
          </button>
        ))}
      </div>

      <div
        id={`machine-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`machine-tab-${active.id}`}
        className="relative grid min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] lg:grid-cols-[1.05fr_.95fr]"
      >
        <div className="relative grid min-h-60 place-items-center overflow-hidden border-b border-white/10 sm:min-h-72 lg:border-b-0 lg:border-r">
          <div className="machine-scan pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[0.62rem] text-steel">
            <Activity className="size-3 text-accent" /> SYSTEM NOMINAL
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[0.62rem] text-steel">
            AXIS / 04-24
          </div>

          <div className={`rotor-assembly rotor-${active.id}`} aria-hidden="true">
            <div className="rotor-orbit" />
            <div className="rotor-blades">
              {Array.from({ length: 12 }, (_, index) => (
                <span key={index} style={{ "--blade-index": index } as CSSProperties} />
              ))}
            </div>
            <div className="rotor-core">
              <div className="rotor-core-inner" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-between p-5 sm:p-7">
          <div>
            <p className="kicker text-accent">{active.eyebrow}</p>
            <h2 className="mt-4 text-3xl uppercase leading-[.92] text-bone sm:text-5xl">
              {active.title}
            </h2>
            <p className="mt-5 text-sm leading-6 text-steel-light/75">{active.description}</p>
          </div>

          <div className="mt-8 grid gap-px border border-white/10 bg-white/10">
            {active.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="flex items-center justify-between bg-graphite/95 px-4 py-3"
              >
                <span className="flex items-center gap-2 text-xs text-steel-light/70">
                  {index === 0 ? (
                    <Zap className="size-3.5 text-accent" />
                  ) : index === 1 ? (
                    <Gauge className="size-3.5 text-accent" />
                  ) : (
                    <Thermometer className="size-3.5 text-accent" />
                  )}
                  {metric.label}
                </span>
                <strong className="font-mono text-sm text-bone">{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
