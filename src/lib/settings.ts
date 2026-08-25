import type { Settings } from "@/lib/store";

export function getPublicGst(settings: Pick<Settings, "gst">) {
  const gst = settings.gst.trim();
  return /placeholder/i.test(gst) ? "" : gst;
}
