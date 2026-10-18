export function formatDateTime(value: string | null | undefined, timeZone?: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium", timeZone }).format(new Date(value));
  } catch {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(new Date(value));
  }
}

export function formatDuration(ms: number | null | undefined) {
  if (ms === null || ms === undefined) return "—";
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)} s`;
  const m = Math.floor(s / 60);
  return `${m} min ${Math.round(s % 60)} s`;
}

export function formatRelative(value: string | null | undefined) {
  if (!value) return "Nunca";
  const diff = Date.now() - new Date(value).getTime();
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const min = Math.round(diff / 60000);
  if (Math.abs(min) < 1) return "agora";
  if (Math.abs(min) < 60) return rtf.format(-min, "minute");
  const h = Math.round(min / 60);
  if (Math.abs(h) < 24) return rtf.format(-h, "hour");
  return rtf.format(-Math.round(h / 24), "day");
}

export function greeting(timeZone?: string) {
  let hour = new Date().getHours();
  try {
    hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(new Date()));
  } catch {}
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
