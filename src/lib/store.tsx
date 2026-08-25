import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Spec = { label: string; value: string };

export type Machine = {
  id: string;
  name: string;
  caption: string;
  description: string;
  available: boolean;
  image: string;
  gallery: string[];
  specs: Spec[];
  order: number;
};

export type Enquiry = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  machine: string;
  requirement: string;
  createdAt: string;
  read: boolean;
  resolved?: boolean;
};

export type ProofPoint = { value: string; label: string };

export type Settings = {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  gst: string;
  marqueeEnabled: boolean;
  marqueeSpeed: "slow" | "normal" | "fast";
  proofPoints: ProofPoint[];
};

const IMG = {
  workshop:
    "https://www.svetenergie.cz/ver/21725003419000/api/stages/files?file=%2Fse%2Fmedia%2Fjaderna-energie%2Ffoto_86_strojovna.jpg&variant=next-fe&width=3840",
  turbine:
    "https://www.ogk2.ru/upload/resize_cache/iblock/55a/hlrfv9z1tikkr5hsuccfncb2k99htisw/612_458_1/DSC_9263.jpg",
  generator: "https://inrorwxhjqnrjj5q-static.micyjz.com/cloud/lnBpoKqijkSRlkqjonrpjq/tu.png",
  boiler:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80",
  plant:
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
  pipes:
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80",
  pump: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80",
  control:
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80",
};

export const HERO_IMAGE = IMG.workshop;

export const seedMachines: Machine[] = [
  {
    id: "ibr-boiler-12tph",
    name: "IBR Water-Tube Boiler — 12 TPH",
    caption: "Refurbished bi-drum boiler, 12 TPH at 45 kg/cm²",
    description:
      "Bi-drum water-tube steam boiler rated 12 TPH at 45 kg/cm² working pressure, previously operated on bagasse and coal firing. Pressure parts inspected, headers hydro-tested and refractory relined. Supplied with combustion air fans, feed pumps and instrumentation. Documentation set available for statutory review; IBR revalidation to be completed by the buyer's authorised inspector.",
    available: true,
    image: IMG.boiler,
    gallery: [IMG.boiler, IMG.pipes, IMG.workshop],
    specs: [
      { label: "Capacity", value: "12 TPH" },
      { label: "Design pressure", value: "45 kg/cm²" },
      { label: "Steam temperature", value: "400 °C" },
      { label: "Fuel", value: "Bagasse / coal, travelling grate" },
      { label: "Condition", value: "Refurbished, pressure parts tested" },
    ],
    order: 0,
  },
  {
    id: "back-pressure-turbine-3mw",
    name: "Back-Pressure Steam Turbine — 3 MW",
    caption: "Multi-stage back-pressure set with reduction gearbox",
    description:
      "Multi-stage back-pressure steam turbine generating set rated 3 MW, inlet 42 kg/cm² / 395 °C with 3.5 kg/cm² exhaust for process steam. Rotor balanced, blades inspected and bearings replaced. Package includes reduction gearbox, lube oil console, governing system and brushless alternator. Suited to sugar, paper and chemical cogeneration duty.",
    available: true,
    image: IMG.turbine,
    gallery: [IMG.turbine, IMG.workshop, IMG.pipes],
    specs: [
      { label: "Output", value: "3 MW" },
      { label: "Inlet steam", value: "42 kg/cm² / 395 °C" },
      { label: "Exhaust", value: "3.5 kg/cm² (back pressure)" },
      { label: "Speed", value: "8,150 rpm via gearbox to 1,500 rpm" },
      { label: "Alternator", value: "Brushless, 11 kV" },
    ],
    order: 1,
  },
  {
    id: "condensing-turbine-8mw",
    name: "Condensing Steam Turbine — 8 MW",
    caption: "Full condensing set with surface condenser package",
    description:
      "Eight megawatt full condensing steam turbine with surface condenser, ejector system and cooling water pumps. Removed from a captive cogeneration plant during a capacity upgrade. Complete mechanical inspection report available; rotor and diaphragms in serviceable condition. Erection and commissioning support can be arranged through our field service partners.",
    available: false,
    image: IMG.workshop,
    gallery: [IMG.workshop, IMG.turbine, IMG.control],
    specs: [
      { label: "Output", value: "8 MW" },
      { label: "Inlet steam", value: "64 kg/cm² / 480 °C" },
      { label: "Condenser", value: "Surface type, twin-pass" },
      { label: "Speed", value: "6,800 rpm" },
      { label: "Condition", value: "Dismantled, stored under cover" },
    ],
    order: 2,
  },
  {
    id: "captive-power-plant-15mw",
    name: "Captive Cogeneration Plant — 15 MW",
    caption: "Complete boiler, turbine and balance-of-plant package",
    description:
      "Complete 15 MW captive cogeneration island comprising a 70 TPH boiler, condensing-cum-extraction turbine, switchyard equipment, water treatment plant and control room. Offered as a single lot with drawings and equipment schedules. Dismantling and load-out can be coordinated on a supervised basis at the seller's site.",
    available: true,
    image: IMG.plant,
    gallery: [IMG.plant, IMG.workshop, IMG.control],
    specs: [
      { label: "Plant output", value: "15 MW" },
      { label: "Boiler", value: "70 TPH, 87 kg/cm²" },
      { label: "Turbine", value: "Extraction-cum-condensing" },
      { label: "Scope", value: "Boiler, TG set, BOP, switchyard" },
      { label: "Availability", value: "Lot sale, supervised dismantling" },
    ],
    order: 3,
  },
  {
    id: "hfo-power-module-6mw",
    name: "HFO Power Module — 6 MW",
    caption: "Containerised heavy fuel oil generating module",
    description:
      "Containerised heavy fuel oil power module rated 6 MW, configured for grid-parallel or island operation. Includes fuel treatment skid, radiators, exhaust silencer and synchronising panel. Running hours and maintenance history documented. Suitable for mining, textile and process plants requiring firm captive capacity.",
    available: false,
    image: IMG.control,
    gallery: [IMG.control, IMG.generator, IMG.plant],
    specs: [
      { label: "Output", value: "6 MW" },
      { label: "Fuel", value: "Heavy fuel oil / furnace oil" },
      { label: "Configuration", value: "Containerised, 3 × 2 MW sets" },
      { label: "Voltage", value: "11 kV, 50 Hz" },
      { label: "Condition", value: "Operational, service records available" },
    ],
    order: 4,
  },
  {
    id: "diesel-genset-1500kva",
    name: "Diesel Generating Set — 1500 kVA",
    caption: "Low running hours, AMF panel and acoustic enclosure",
    description:
      "1500 kVA prime-rated diesel generating set with acoustic enclosure, AMF panel and 990-litre base fuel tank. Recorded running hours under 4,000. Engine compression tested, alternator insulation resistance verified and load bank tested before despatch. Ideal standby capacity for hospitals, data facilities and manufacturing lines.",
    available: true,
    image: IMG.generator,
    gallery: [IMG.generator, IMG.control, IMG.pipes],
    specs: [
      { label: "Rating", value: "1500 kVA prime" },
      { label: "Voltage", value: "415 V, 50 Hz" },
      { label: "Running hours", value: "Under 4,000 (logged)" },
      { label: "Enclosure", value: "Acoustic, 75 dB(A) at 1 m" },
      { label: "Testing", value: "Load bank tested at 100%" },
    ],
    order: 5,
  },
  {
    id: "diesel-genset-500kva",
    name: "Diesel Generating Set — 500 kVA",
    caption: "Skid-mounted standby set with digital controller",
    description:
      "500 kVA skid-mounted standby diesel generating set with digital genset controller, battery charger and radiator cooling. Overhauled fuel injection system and new filtration. Compact footprint for plant rooms with limited access. Delivered with test certificate and operating manuals.",
    available: true,
    image: IMG.pump,
    gallery: [IMG.pump, IMG.generator, IMG.control],
    specs: [
      { label: "Rating", value: "500 kVA standby" },
      { label: "Voltage", value: "415 V, 50 Hz" },
      { label: "Controller", value: "Digital, auto-start capable" },
      { label: "Cooling", value: "Radiator, ambient 50 °C" },
      { label: "Condition", value: "Overhauled fuel system" },
    ],
    order: 6,
  },
  {
    id: "air-cooled-condenser-bank",
    name: "Boiler Feed Pump & Deaerator Package",
    caption: "Ancillary set: feed pumps, deaerator and feed water tank",
    description:
      "Ancillary package comprising two multistage boiler feed pumps with motors, a spray-tray deaerator and a 25 m³ feed water storage tank. Suited to boilers up to 30 TPH. Pumps stripped, inspected and reassembled with new mechanical seals. Sold as a package or as individual items on request.",
    available: false,
    image: IMG.pipes,
    gallery: [IMG.pipes, IMG.pump, IMG.workshop],
    specs: [
      { label: "Pumps", value: "2 × multistage, 30 m³/h at 55 bar" },
      { label: "Deaerator", value: "Spray-tray, 30 TPH" },
      { label: "Storage tank", value: "25 m³ horizontal" },
      { label: "Motors", value: "75 kW, 415 V" },
      { label: "Condition", value: "Overhauled, new seals" },
    ],
    order: 7,
  },
];

const CONTACT_DETAILS = {
  address: "Gaur City Mall, Office No. 811, Greater Noida",
  phone: "+91 87965 65443 · +91 87968 86223",
  email: "infor.shiventerprise26@gmail.com · anil04172@gmail.com",
  whatsapp: "+91 87968 86223",
} satisfies Pick<Settings, "address" | "phone" | "email" | "whatsapp">;

export const seedSettings: Settings = {
  businessName: "Shiv Enterprises",
  ...CONTACT_DETAILS,
  gst: "",
  marqueeEnabled: true,
  marqueeSpeed: "normal",
  proofPoints: [
    { value: "180+", label: "Machines handled" },
    { value: "14", label: "Countries shipped to" },
    { value: "48 hrs", label: "Typical quote turnaround" },
    { value: "100%", label: "Inspection reports shared" },
  ],
};

const seedEnquiries: Enquiry[] = [
  {
    id: "enq-1",
    name: "Rahul Mehta",
    company: "Sunrise Paper Mills Pvt Ltd",
    phone: "+91 90000 11111",
    email: "rahul.mehta@example.com",
    machine: "Back-Pressure Steam Turbine — 3 MW",
    requirement:
      "Looking to add 3 MW cogeneration at our Vapi unit. Need inspection report and delivery timeline to Gujarat.",
    createdAt: new Date(Date.now() - 3600_000 * 6).toISOString(),
    read: false,
  },
  {
    id: "enq-2",
    name: "Ayesha Karim",
    company: "Delta Energy Trading FZE",
    phone: "+971 50 000 0000",
    email: "ayesha@example.com",
    machine: "Diesel Generating Set — 1500 kVA",
    requirement:
      "Require two units FOB Nhava Sheva. Please share load test records and packing dimensions.",
    createdAt: new Date(Date.now() - 3600_000 * 52).toISOString(),
    read: true,
  },
];

export type StoreState = {
  machines: Machine[];
  settings: Settings;
  enquiries: Enquiry[];
};

const STORAGE_KEY = "ironclad-machinery-store-v1";
const CONTACT_MIGRATION_KEY = "shiv-enterprises-contact-details-v3";

export const defaultState: StoreState = {
  machines: seedMachines,
  settings: seedSettings,
  enquiries: seedEnquiries,
};

type StoreContextValue = {
  state: StoreState;
  hydrated: boolean;
  syncing: boolean;
  refresh: () => Promise<void>;
  addMachine: (m: Omit<Machine, "id" | "order">) => Promise<void>;
  updateMachine: (id: string, patch: Omit<Machine, "id" | "order">) => Promise<void>;
  deleteMachine: (id: string) => Promise<void>;
  moveMachine: (id: string, dir: -1 | 1) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  markEnquiry: (id: string, read: boolean) => Promise<void>;
  resolveEnquiry: (id: string, resolved: boolean) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { getSharedStore } = await import("@/lib/shared-store-server");
      const shared = await getSharedStore();
      setState(shared);
    } catch (error) {
      console.error("Could not refresh shared machinery data", error);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreState;
        if (parsed?.machines && parsed?.settings) {
          const shouldUpdateContact =
            window.localStorage.getItem(CONTACT_MIGRATION_KEY) !== "complete";
          setState({
            ...defaultState,
            ...parsed,
            settings: {
              ...seedSettings,
              ...parsed.settings,
              ...(shouldUpdateContact ? CONTACT_DETAILS : {}),
            },
          });
          if (shouldUpdateContact) {
            window.localStorage.setItem(CONTACT_MIGRATION_KEY, "complete");
          }
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    void refresh().finally(() => setHydrated(true));
  }, [refresh]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  useEffect(() => {
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    const timer = window.setInterval(() => void refresh(), 12_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const mutate = useCallback(
    async (
      input: Parameters<(typeof import("@/lib/shared-store-server"))["mutateSharedStore"]>[0],
    ) => {
      setSyncing(true);
      try {
        const { mutateSharedStore } = await import("@/lib/shared-store-server");
        setState(await mutateSharedStore(input));
      } finally {
        setSyncing(false);
      }
    },
    [],
  );

  const addMachine = useCallback(
    (machine: Omit<Machine, "id" | "order">) => mutate({ data: { action: "addMachine", machine } }),
    [mutate],
  );
  const updateMachine = useCallback(
    (id: string, machine: Omit<Machine, "id" | "order">) =>
      mutate({ data: { action: "updateMachine", id, machine } }),
    [mutate],
  );
  const deleteMachine = useCallback(
    (id: string) => mutate({ data: { action: "deleteMachine", id } }),
    [mutate],
  );
  const moveMachine = useCallback(
    (id: string, direction: -1 | 1) => mutate({ data: { action: "moveMachine", id, direction } }),
    [mutate],
  );
  const toggleAvailability = useCallback(
    (id: string) => mutate({ data: { action: "toggleAvailability", id } }),
    [mutate],
  );
  const updateSettings = useCallback(
    (settings: Settings) => mutate({ data: { action: "updateSettings", settings } }),
    [mutate],
  );
  const markEnquiry = useCallback(
    (id: string, value: boolean) => mutate({ data: { action: "markEnquiry", id, value } }),
    [mutate],
  );
  const resolveEnquiry = useCallback(
    (id: string, value: boolean) => mutate({ data: { action: "resolveEnquiry", id, value } }),
    [mutate],
  );
  const deleteEnquiry = useCallback(
    (id: string) => mutate({ data: { action: "deleteEnquiry", id } }),
    [mutate],
  );
  const resetDemoData = useCallback(() => mutate({ data: { action: "reset" } }), [mutate]);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      hydrated,
      syncing,
      refresh,
      addMachine,
      updateMachine,
      deleteMachine,
      moveMachine,
      toggleAvailability,
      updateSettings,
      markEnquiry,
      resolveEnquiry,
      deleteEnquiry,
      resetDemoData,
    }),
    [
      state,
      hydrated,
      syncing,
      refresh,
      addMachine,
      updateMachine,
      deleteMachine,
      moveMachine,
      toggleAvailability,
      updateSettings,
      markEnquiry,
      resolveEnquiry,
      deleteEnquiry,
      resetDemoData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useMachines() {
  const { state } = useStore();
  return useMemo(() => [...state.machines].sort((a, b) => a.order - b.order), [state.machines]);
}
