import { WHATSAPP_URL } from "@/lib/constants";

export function buildWhatsAppUrl(raw?: string | null): string {
  if (!raw || !String(raw).trim()) {
    return WHATSAPP_URL;
  }
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) {
    return WHATSAPP_URL;
  }
  return `https://wa.me/${digits}`;
}
