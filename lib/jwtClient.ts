/** Base64url → binary string (handles JWT length % 4 padding for atob). */
function base64UrlToPayloadJson(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
  return atob(padded);
}

/** Decode JWT expiry without verifying signature (client-only UX). */
export function isJwtExpired(token: string): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return true;
    const json = base64UrlToPayloadJson(part);
    const payload = JSON.parse(json) as { exp?: number };
    if (payload.exp === undefined) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return false;
  }
}
