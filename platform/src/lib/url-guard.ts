import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

function isPrivateIp(ip: string) {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7));
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

// Evita que o servidor seja usado para sondar a rede interna (SSRF).
export async function assertPublicUrl(raw: string): Promise<string | null> {
  if (process.env.ALLOW_PRIVATE_API_URLS === "true") return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return "URL inválida.";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return "Use http:// ou https://";
  try {
    const host = url.hostname.replace(/^\[|\]$/g, "");
    const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
    if (addresses.some((a) => isPrivateIp(a.address))) return "Endereços internos ou locais não são permitidos.";
  } catch {
    return "Não foi possível resolver o domínio.";
  }
  return null;
}
