import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Boxes,
  Check,
  CircleGauge,
  Eye,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  PackageCheck,
  PackageX,
  Pencil,
  Plus,
  Save,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { getAdminStatus, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { type Machine, type Settings as SiteSettings, useMachines, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminStatus(),
  component: AdminRoute,
});

function AdminRoute() {
  const status = Route.useLoaderData();
  const [authenticated, setAuthenticated] = useState(status.authenticated);
  if (!authenticated)
    return <AuthScreen configured={status.configured} onSuccess={() => setAuthenticated(true)} />;
  return (
    <AdminConsole
      onLogout={async () => {
        await logoutAdmin();
        setAuthenticated(false);
      }}
    />
  );
}

function AuthScreen({ configured, onSuccess }: { configured: boolean; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setError("");
    setBusy(true);
    try {
      const result = await loginAdmin({ data: { password } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPassword("");
      onSuccess();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="surface-dark rule-grid grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md rounded-[2rem] border border-white/15 bg-graphite p-7 shadow-[0_30px_90px_-45px_var(--safety)] sm:p-9">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-steel-light">
          <ArrowLeft className="size-4 text-accent" />
          Public site
        </Link>
        <LockKeyhole className="mt-10 size-8 text-accent" />
        <p className="kicker mt-6 text-accent">Secure administration</p>
        <h1 className="mt-2 text-4xl uppercase text-bone">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-steel-light/75">
          Enter the server-managed administrator password.
        </p>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm text-bone">
            Password
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field text-foreground"
            />
          </label>
          {!configured && (
            <p role="alert" className="text-sm text-red-300">
              Admin authentication is not configured on the server.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            disabled={busy || !configured}
            className="mt-2 h-12 rounded-full bg-accent font-semibold text-graphite disabled:opacity-50"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-xs leading-5 text-steel">
          Credentials are verified on the server. This browser receives only a secure, HTTP-only
          session cookie.
        </p>
      </section>
    </main>
  );
}

type Tab = "overview" | "inventory" | "enquiries" | "settings";
function AdminConsole({ onLogout }: { onLogout: () => void }) {
  const { state, syncing } = useStore();
  const machines = useMachines();
  const [tab, setTab] = useState<Tab>("overview");
  const [mobile, setMobile] = useState(false);
  const unread = state.enquiries.filter((e) => !e.read).length;
  const nav = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "inventory" as const, label: "Inventory", icon: Boxes },
    { id: "enquiries" as const, label: "Enquiries", icon: Inbox, badge: unread },
    { id: "settings" as const, label: "Site settings", icon: Settings },
  ];
  return (
    <div className="admin-shell min-h-screen bg-background lg:grid lg:grid-cols-[280px_1fr]">
      <aside
        className={`surface-dark fixed inset-y-0 left-0 z-50 w-[280px] rounded-r-[2rem] border-r border-white/10 p-5 transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <strong className="display text-xl uppercase text-bone">Shiv Enterprises</strong>
            <p className="kicker text-[.55rem] text-accent">Inventory studio</p>
          </div>
          <button className="lg:hidden" onClick={() => setMobile(false)}>
            <X className="size-5" />
          </button>
        </div>
        <nav className="mt-10 grid gap-1">
          {nav.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setMobile(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${tab === id ? "bg-accent text-graphite" : "text-steel-light hover:bg-white/5"}`}
            >
              <Icon className="size-4" />
              <span>{label}</span>
              {badge ? (
                <span className="ml-auto grid size-5 place-items-center bg-graphite text-[10px] text-bone">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 grid gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 border border-white/15 px-3 py-2 text-sm text-steel-light"
          >
            <Eye className="size-4 text-accent" />
            View live site
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-steel"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main>
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/95 px-4 backdrop-blur sm:px-7">
          <button className="mr-4 lg:hidden" onClick={() => setMobile(true)}>
            <Menu className="size-5" />
          </button>
          <div>
            <p className="kicker text-accent">Admin / {tab}</p>
            <h1 className="display text-lg uppercase">{nav.find((n) => n.id === tab)?.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`size-2 rounded-full ${syncing ? "animate-pulse bg-amber-500" : "bg-emerald-500"}`}
            />
            {syncing ? "Saving shared data…" : "Shared site data"}
          </div>
        </header>
        <div className="p-4 sm:p-7">
          {tab === "overview" && <Overview />}
          {tab === "inventory" && <InventoryManager />}
          {tab === "enquiries" && <EnquiryInbox />}
          {tab === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}

function Overview() {
  const { state } = useStore();
  const machines = useMachines();
  const stats = [
    { l: "Total machines", v: machines.length, i: Boxes },
    { l: "Available", v: machines.filter((m) => m.available).length, i: PackageCheck },
    { l: "Out of stock", v: machines.filter((m) => !m.available).length, i: PackageX },
    { l: "Unread enquiries", v: state.enquiries.filter((e) => !e.read).length, i: Inbox },
  ];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ l, v, i: I }) => (
          <div key={l} className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <I className="size-5 text-accent" />
              <span className="font-mono text-xs text-muted-foreground">LIVE</span>
            </div>
            <strong className="display mt-7 block text-4xl">{v}</strong>
            <span className="text-sm text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-[1.5rem] border border-border bg-card p-5">
          <h2 className="text-2xl uppercase">Floor availability</h2>
          <div className="mt-8 flex items-end justify-between">
            <div>
              <strong className="display text-6xl">
                {machines.filter((machine) => machine.available).length}
              </strong>
              <p className="text-sm text-muted-foreground">available now</p>
            </div>
            <span className="text-sm text-muted-foreground">of {machines.length} records</span>
          </div>
          <div className="mt-6 h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${machines.length ? (machines.filter((machine) => machine.available).length / machines.length) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="mt-7 grid gap-2">
            {machines.slice(0, 3).map((machine) => (
              <div
                key={machine.id}
                className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm"
              >
                <span className="max-w-[70%] truncate font-semibold">{machine.name}</span>
                <span className={machine.available ? "text-primary" : "text-muted-foreground"}>
                  {machine.available ? "Live" : "Held"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="surface-dark rounded-[1.5rem] p-6">
          <CircleGauge className="size-7 text-accent" />
          <h2 className="mt-6 text-3xl uppercase text-bone">Ready to operate</h2>
          <p className="mt-3 text-sm leading-6 text-steel-light/75">
            Use Inventory to change stock, photos and captions. Site settings control the public
            marquee and company details.
          </p>
        </div>
      </div>
    </div>
  );
}

const emptyMachine: Omit<Machine, "id" | "order"> = {
  name: "",
  caption: "",
  description: "",
  available: true,
  image: "",
  gallery: [],
  specs: [],
};
function InventoryManager() {
  const store = useStore();
  const machines = useMachines();
  const [editing, setEditing] = useState<Machine | "new" | null>(null);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl uppercase">Machine records</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, reorder and change live availability.
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex h-11 items-center gap-2 bg-accent px-5 font-semibold"
        >
          <Plus className="size-4" />
          Add machine
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-border bg-card">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-4">Machine</th>
              <th className="p-4">Status</th>
              <th className="p-4">Order</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m, i) => (
              <tr key={m.id} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        m.image ||
                        "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=300&q=60"
                      }
                      alt=""
                      className="size-14 object-cover"
                    />
                    <div>
                      <strong className="block max-w-xs">{m.name}</strong>
                      <span className="text-xs text-muted-foreground">{m.caption}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => void store.toggleAvailability(m.id).catch(showSaveError)}
                    className={`px-3 py-2 text-xs font-semibold uppercase ${m.available ? "bg-accent text-graphite" : "bg-graphite text-bone"}`}
                  >
                    {m.available ? "Available" : "Out of stock"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex">
                    <button
                      disabled={i === 0}
                      onClick={() => void store.moveMachine(m.id, -1).catch(showSaveError)}
                      className="grid size-9 place-items-center border border-border disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      disabled={i === machines.length - 1}
                      onClick={() => void store.moveMachine(m.id, 1).catch(showSaveError)}
                      className="grid size-9 place-items-center border border-l-0 border-border disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditing(m)}
                      className="grid size-9 place-items-center border border-border"
                      aria-label={`Edit ${m.name}`}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${m.name}?`))
                          void store.deleteMachine(m.id).catch(showSaveError);
                      }}
                      className="grid size-9 place-items-center border border-destructive/40 text-destructive"
                      aria-label={`Delete ${m.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <MachineEditor
          machine={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function MachineEditor({ machine, onClose }: { machine: Machine | null; onClose: () => void }) {
  const store = useStore();
  const [form, setForm] = useState<Omit<Machine, "id" | "order">>(
    machine
      ? {
          name: machine.name,
          caption: machine.caption,
          description: machine.description,
          available: machine.available,
          image: machine.image,
          gallery: machine.gallery,
          specs: machine.specs,
        }
      : emptyMachine,
  );
  const [specText, setSpecText] = useState(
    form.specs.map((s) => `${s.label}: ${s.value}`).join("\n"),
  );
  const [galleryUrl, setGalleryUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.caption.trim()) return;
    const specs = specText
      .split("\n")
      .map((line) => {
        const [label, ...value] = line.split(":");
        return { label: label?.trim() || "", value: value.join(":").trim() };
      })
      .filter((s) => s.label && s.value);
    const payload = {
      ...form,
      image:
        form.image ||
        form.gallery[0] ||
        "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80",
      specs,
    };
    setSaving(true);
    setSaveError("");
    try {
      if (machine) await store.updateMachine(machine.id, payload);
      else await store.addMachine(payload);
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "The machine could not be saved.");
    } finally {
      setSaving(false);
    }
  }
  function upload(file?: File) {
    if (!file) return;
    if (file.size > 1_500_000) {
      alert("Use an image under 1.5 MB or paste a hosted image URL.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("image", String(reader.result));
    reader.readAsDataURL(file);
  }
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-graphite/70 p-3 sm:p-6">
      <form onSubmit={save} className="mx-auto max-w-4xl bg-background">
        <div className="sticky top-0 z-10 flex items-center border-b border-border bg-background px-5 py-4">
          <div>
            <p className="kicker text-accent">Inventory editor</p>
            <h2 className="text-2xl uppercase">{machine ? "Update machine" : "Add machine"}</h2>
          </div>
          <button
            type="button"
            className="ml-auto grid size-10 place-items-center"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-7 p-5 md:grid-cols-2">
          <div className="grid content-start gap-4">
            <Field label="Machine name *">
              <input
                className="field"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </Field>
            <Field label="Caption *">
              <input
                className="field"
                value={form.caption}
                onChange={(e) => set("caption", e.target.value)}
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={7}
                className="field"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <Field label="Specifications (one Label: Value per line)">
              <textarea
                rows={7}
                className="field font-mono text-xs"
                value={specText}
                onChange={(e) => setSpecText(e.target.value)}
              />
            </Field>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => set("available", e.target.checked)}
                className="size-4"
              />
              Available now
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold">Primary photo</p>
            <div className="mt-2 aspect-[4/3] overflow-hidden border border-border bg-muted">
              {form.image ? (
                <img src={form.image} alt="Preview" className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-sm text-muted-foreground">
                  No photo
                </div>
              )}
            </div>
            <div className="mt-3 grid gap-3">
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 border border-border bg-card text-sm font-semibold">
                <Upload className="size-4" />
                Upload local image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => upload(e.target.files?.[0])}
                />
              </label>
              <Field label="Or paste image URL">
                <input
                  className="field"
                  value={form.image.startsWith("data:") ? "" : form.image}
                  onChange={(e) => set("image", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-7">
              <p className="text-sm font-semibold">Gallery photos</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.gallery.map((img, i) => (
                  <div key={`${img}-${i}`} className="relative aspect-square">
                    <img src={img} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "gallery",
                          form.gallery.filter((_, n) => n !== i),
                        )
                      }
                      className="absolute right-1 top-1 grid size-7 place-items-center bg-graphite text-bone"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  className="field"
                  placeholder="Paste gallery image URL"
                  value={galleryUrl}
                  onChange={(e) => setGalleryUrl(e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Add gallery URL"
                  onClick={() => {
                    if (galleryUrl.trim()) {
                      set("gallery", [...form.gallery, galleryUrl.trim()]);
                      setGalleryUrl("");
                    }
                  }}
                  className="grid size-11 shrink-0 place-items-center bg-graphite text-bone"
                >
                  <ImagePlus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-background px-5 py-4">
          <button type="button" onClick={onClose} className="h-11 border border-border px-5">
            Cancel
          </button>
          {saveError && (
            <p role="alert" className="mr-auto text-sm text-destructive">
              {saveError}
            </p>
          )}
          <button
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 bg-accent px-5 font-semibold disabled:cursor-wait disabled:opacity-60"
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save machine"}
          </button>
        </div>
      </form>
    </div>
  );
}

function EnquiryInbox() {
  const { state, markEnquiry, resolveEnquiry, deleteEnquiry } = useStore();
  const enquiries = state.enquiries;
  return (
    <div>
      <h2 className="text-3xl uppercase">Buyer enquiries</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Submitted forms are stored securely and appear here for every admin session.
      </p>
      {enquiries.length ? (
        <div className="mt-6 grid gap-4">
          {enquiries.map((e) => (
            <article
              key={e.id}
              className={`border bg-card p-5 ${!e.read ? "border-accent" : "border-border"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!e.read && (
                      <span className="kicker bg-accent px-2 py-1 text-graphite">Unread</span>
                    )}
                    {e.resolved && (
                      <span className="kicker bg-graphite px-2 py-1 text-bone">Resolved</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl uppercase">
                    {e.name} · {e.company || "Independent buyer"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {e.email} · {e.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => void markEnquiry(e.id, !e.read).catch(showSaveError)}
                    className="border border-border px-3 py-2 text-xs font-semibold"
                  >
                    Mark {e.read ? "unread" : "read"}
                  </button>
                  <button
                    onClick={() => void resolveEnquiry(e.id, !e.resolved).catch(showSaveError)}
                    className="border border-border px-3 py-2 text-xs font-semibold"
                  >
                    {e.resolved ? "Reopen" : "Resolve"}
                  </button>
                  <button
                    aria-label="Delete enquiry"
                    onClick={() => {
                      if (confirm("Delete this enquiry?"))
                        void deleteEnquiry(e.id).catch(showSaveError);
                    }}
                    className="grid size-9 place-items-center border border-destructive/40 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 border-l-4 border-accent bg-muted/45 p-4">
                <p className="kicker text-muted-foreground">{e.machine || "General requirement"}</p>
                <p className="mt-2 text-sm leading-6">{e.requirement}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-steel p-14 text-center">
          <Inbox className="mx-auto size-8 text-accent" />
          <h3 className="mt-4 text-2xl uppercase">Inbox is clear</h3>
        </div>
      )}
    </div>
  );
}

function SettingsPanel() {
  const { state, updateSettings, resetDemoData } = useStore();
  const [form, setForm] = useState<SiteSettings>(state.settings);
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  async function save(e: FormEvent) {
    e.preventDefault();
    try {
      await updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (error) {
      showSaveError(error);
    }
  }
  return (
    <form onSubmit={save}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl uppercase">Site & company settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes update the public site immediately.
          </p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 bg-accent px-5 font-semibold">
          {saved ? <Check className="size-4" /> : <Save className="size-4" />}
          {saved ? "Saved" : "Save settings"}
        </button>
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <section className="border border-border bg-card p-5">
          <h3 className="text-2xl uppercase">Machine marquee</h3>
          <label className="mt-5 flex items-center justify-between border border-border p-4">
            <span>
              <strong className="block text-sm">Show machinery marquee</strong>
              <span className="text-xs text-muted-foreground">
                Continuous equipment panel on homepage
              </span>
            </span>
            <input
              type="checkbox"
              className="size-5"
              checked={form.marqueeEnabled}
              onChange={(e) => set("marqueeEnabled", e.target.checked)}
            />
          </label>
          <Field label="Marquee speed">
            <select
              className="field"
              value={form.marqueeSpeed}
              onChange={(e) => set("marqueeSpeed", e.target.value as SiteSettings["marqueeSpeed"])}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </Field>
        </section>
        <section className="border border-border bg-card p-5">
          <h3 className="text-2xl uppercase">Company identity</h3>
          <div className="mt-5 grid gap-4">
            <Field label="Business name">
              <input
                className="field"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
              />
            </Field>
            <Field label="Address">
              <textarea
                rows={3}
                className="field"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input
                className="field"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <input
                className="field"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp number">
              <input
                className="field"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </Field>
            <Field label="GST number">
              <input
                className="field"
                value={form.gst}
                onChange={(e) => set("gst", e.target.value)}
              />
            </Field>
          </div>
        </section>
        <section className="border border-border bg-card p-5 xl:col-span-2">
          <h3 className="text-2xl uppercase">Homepage proof points</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {form.proofPoints.map((p, i) => (
              <div key={i} className="border border-border p-4">
                <Field label="Value">
                  <input
                    className="field"
                    value={p.value}
                    onChange={(e) =>
                      set(
                        "proofPoints",
                        form.proofPoints.map((x, n) =>
                          n === i ? { ...x, value: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Label">
                  <input
                    className="field"
                    value={p.label}
                    onChange={(e) =>
                      set(
                        "proofPoints",
                        form.proofPoints.map((x, n) =>
                          n === i ? { ...x, label: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>
        <section className="border border-destructive/30 bg-card p-5 xl:col-span-2">
          <h3 className="text-xl uppercase text-destructive">Shared data reset</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Restore the original inventory and settings for every visitor and clear all enquiries.
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset shared site data and permanently clear all enquiries?"))
                void resetDemoData().catch(showSaveError);
            }}
            className="mt-4 border border-destructive px-4 py-2 text-sm font-semibold text-destructive"
          >
            Reset demo data
          </button>
        </section>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span>{label}</span>
      {children}
    </label>
  );
}

function showSaveError(error: unknown) {
  alert(
    error instanceof Error ? error.message : "The change could not be saved. Please try again.",
  );
}
