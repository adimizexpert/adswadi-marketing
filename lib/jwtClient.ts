/** Decode JWT expiry without verifying signature (client-only UX). */
export function isJwtExpired(token: string): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return true;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { exp?: number };
    if (payload.exp === undefined) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
