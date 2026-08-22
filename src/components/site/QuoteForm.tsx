import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useMachines } from "@/lib/store";
import { submitEnquiry } from "@/lib/shared-store-server";

export function QuoteForm({ initialMachine = "" }: { initialMachine?: string }) {
  const machines = useMachines();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    machine: initialMachine,
    requirement: "",
    website: "",
  });
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.requirement.trim())
      return setError("Please complete the required fields.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    setSending(true);
    try {
      const result = await submitEnquiry({ data: form });
      if (!result.ok) return setError(result.error);
      setWarning(result.emailed ? "" : result.warning || "Your enquiry was saved for the team.");
      setSent(true);
    } catch {
      setError("We could not send your enquiry. Please try again or contact us on WhatsApp.");
    } finally {
      setSending(false);
    }
  };
  if (sent)
    return (
      <div className="border border-accent bg-accent/10 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-accent" />
        <h3 className="mt-4 text-2xl uppercase">Enquiry received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your request is safely recorded and the Shiv Enterprises team has been notified.
        </p>
        {warning && <p className="mt-3 text-xs text-amber-700">{warning}</p>}
        <button
          className="mt-5 border border-graphite px-4 py-2 text-sm font-semibold"
          onClick={() => {
            setSent(false);
            setWarning("");
            setForm({
              name: "",
              company: "",
              phone: "",
              email: "",
              machine: initialMachine,
              requirement: "",
              website: "",
            });
          }}
        >
          Send another
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name *">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="field"
          />
        </Field>
        <Field label="Company">
          <input
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className="field"
          />
        </Field>
        <Field label="Phone *">
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="field"
          />
        </Field>
        <Field label="Email *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="field"
          />
        </Field>
      </div>
      <Field label="Machine">
        <select
          value={form.machine}
          onChange={(e) => set("machine", e.target.value)}
          className="field"
        >
          <option value="">General requirement</option>
          {machines.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Requirement *">
        <textarea
          rows={5}
          value={form.requirement}
          onChange={(e) => set("requirement", e.target.value)}
          className="field"
          placeholder="Capacity, duty, preferred condition, delivery destination and timeline"
        />
      </Field>
      <label className="hidden" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex h-12 items-center justify-center gap-2 bg-accent px-6 font-semibold text-graphite disabled:cursor-wait disabled:opacity-65"
      >
        {sending ? "Sending…" : "Submit enquiry"} <Send className="size-4" />
      </button>
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
